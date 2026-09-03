# Dependencias
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
import random
from collections import deque

class DuelingDQNetwork(nn.Module):
    """
    Arquitectura Dueling DQN:
    Separa la estimación del valor del estado V(s) y la ventaja A(s,a).
    """
    def __init__(self, input_size, n_acciones, hidden_size=128):
        super(DuelingDQNetwork, self).__init__()
        
        # Capa base común
        self.feature_layer = nn.Sequential(
            nn.Linear(input_size, hidden_size),
            nn.ReLU()
        )
        
        # Stream de Valor V(s)
        self.value_stream = nn.Sequential(
            nn.Linear(hidden_size, hidden_size),
            nn.ReLU(),
            nn.Linear(hidden_size, 1)
        )
        
        # Stream de Ventaja A(s,a)
        self.advantage_stream = nn.Sequential(
            nn.Linear(hidden_size, hidden_size),
            nn.ReLU(),
            nn.Linear(hidden_size, n_acciones)
        )

    def forward(self, x):
        features = self.feature_layer(x)
        value = self.value_stream(features)
        advantages = self.advantage_stream(features)
        
        # Combinación Q(s,a) = V(s) + (A(s,a) - mean(A(s,a)))
        # Restar la media ayuda a la estabilidad y unicidad
        q_valores = value + (advantages - advantages.mean(dim=1, keepdim=True))
        return q_valores

class ReplayBuffer:
    def __init__(self, capacidad=20000):
        self.buffer = deque(maxlen=capacidad)

    def agregar(self, estado, accion, recompensa, siguiente_estado, terminado):
        self.buffer.append((estado, accion, recompensa, siguiente_estado, terminado))

    def sample(self, batch_size):
        batch = random.sample(self.buffer, batch_size)
        estados, acciones, recompensas, siguientes, terminados = zip(*batch)
        return (np.array(estados), np.array(acciones), np.array(recompensas, dtype=np.float32),
                np.array(siguientes), np.array(terminados, dtype=np.float32))

    def __len__(self):
        return len(self.buffer)

class ImprovedDQNAgent:
    """
    Agente DQN con Double DQN y Dueling DQN.
    """
    def __init__(self, input_size, n_acciones, lr=0.0005, gamma=0.9, 
                 epsilon_start=1.0, epsilon_min=0.01, epsilon_decay=0.995,
                 target_update=10):
        self.n_acciones = n_acciones
        self.gamma = gamma
        self.epsilon = epsilon_start
        self.epsilon_min = epsilon_min
        self.epsilon_decay = epsilon_decay
        self.target_update = target_update
        self.episode_count = 0
        
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        # Inicializar redes Dueling
        self.q_network = DuelingDQNetwork(input_size, n_acciones).to(self.device)
        self.target_network = DuelingDQNetwork(input_size, n_acciones).to(self.device)
        self.target_network.load_state_dict(self.q_network.state_dict())
        self.target_network.eval()
        
        self.optimizer = optim.Adam(self.q_network.parameters(), lr=lr)
        self.loss_fn = nn.MSELoss()
        
        self.memory = ReplayBuffer()

    def seleccionar_accion(self, estado, entrenando=True):
        if entrenando and random.random() < self.epsilon:
            return random.randint(0, self.n_acciones - 1)
            
        with torch.no_grad():
            estado_t = torch.FloatTensor(estado).unsqueeze(0).to(self.device)
            q_valores = self.q_network(estado_t)
            return q_valores.argmax().item()

    def recordar(self, estado, accion, recompensa, siguiente, terminado):
        self.memory.agregar(estado, accion, recompensa, siguiente, terminado)

    def entrenar(self, batch_size=64):
        if len(self.memory) < batch_size:
            return 0
            
        estados, acciones, recompensas, siguientes, terminados = self.memory.sample(batch_size)
        
        estados_t = torch.FloatTensor(estados).to(self.device)
        acciones_t = torch.LongTensor(acciones).to(self.device)
        recompensas_t = torch.FloatTensor(recompensas).to(self.device)
        siguientes_t = torch.FloatTensor(siguientes).to(self.device)
        terminados_t = torch.FloatTensor(terminados).to(self.device)
        
        # Q actual
        q_actual = self.q_network(estados_t).gather(1, acciones_t.unsqueeze(1)).squeeze()
        
        # LOGICA DOUBLE DQN:
        # · Usar red principal para elegir la mejor acción en s'
        # · Usar red target para evaluar esa acción
        with torch.no_grad():
            next_actions = self.q_network(siguientes_t).argmax(dim=1, keepdim=True)
            q_siguientes = self.target_network(siguientes_t).gather(1, next_actions).squeeze()
            targets = recompensas_t + (1 - terminados_t) * self.gamma * q_siguientes
            
        loss = self.loss_fn(q_actual, targets)
        
        self.optimizer.zero_grad()
        loss.backward()
        torch.nn.utils.clip_grad_norm_(self.q_network.parameters(), 1.0)
        self.optimizer.step()
        
        return loss.item()

    def fin_episodio(self):
        self.episode_count += 1
        if self.episode_count % self.target_update == 0:
            self.target_network.load_state_dict(self.q_network.state_dict())
            
        # Decaimiento epsilon
        self.epsilon = max(self.epsilon_min, self.epsilon * self.epsilon_decay)

    def guardar(self, path):
        torch.save(self.q_network.state_dict(), path)

    def cargar(self, path):
        self.q_network.load_state_dict(torch.load(path, map_location=self.device))
        self.target_network.load_state_dict(self.q_network.state_dict())
