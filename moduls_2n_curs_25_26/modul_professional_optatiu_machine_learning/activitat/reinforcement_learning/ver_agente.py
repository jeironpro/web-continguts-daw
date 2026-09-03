import gymnasium as gym
from snake import Snake
from agente import ImprovedDQNAgent
import torch
import time

def modo_visual():
    # Crear el entorno con render_mode='human'
    env = Snake(render_mode='human')
    
    # Inicializar el agente
    input_size = env.observation_space.shape[0]
    n_acciones = env.action_space.n
    agente = ImprovedDQNAgent(input_size=input_size, n_acciones=n_acciones)
    
    # Cargar el mejor modelo guardado
    print("Cargando best_snake_model.pth...")
    try:
        agente.cargar('best_snake_model.pth')
        print("Modelo cargado con éxito.")
    except Exception as e:
        print(f"Error al cargar el modelo: {e}")
        return

    # Bucle de ejecución
    while True:
        obs, _ = env.reset()
        done = False
        score = 0
        
        while not done:
            # El agente elige la mejor acción sin exploración
            action = agente.seleccionar_accion(obs, entrenando=False)
            
            obs, reward, terminated, truncated, _ = env.step(action)
            done = terminated or truncated
            
            # El renderizado es automático al usar render_mode='human'
            # Añadimos un pequeño delay si va muy rápido
            time.sleep(0.05)
            
        print(f"Partida terminada. Puntuación: {env.score}")
        time.sleep(1) # Pausa antes de reiniciar

if __name__ == "__main__":
    modo_visual()
