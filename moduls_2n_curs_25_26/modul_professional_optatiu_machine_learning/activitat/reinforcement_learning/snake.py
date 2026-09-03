# Dependencias
import gymnasium as gym
from gymnasium import spaces
import numpy as np
import pygame
import random
from enum import Enum
from collections import namedtuple

# Configuración de constantes
BLOCK_SIZE = 20
SPEED = 40

class Action(Enum):
    RIGHT = 0
    LEFT = 1
    UP = 2
    DOWN = 3

Point = namedtuple('Point', 'x, y')

# Colores (RGB)
WHITE = (255, 255, 255)
RED = (200, 0, 0)
BLUE1 = (0, 0, 255)
BLUE2 = (0, 100, 255)
BLACK = (0, 0, 0)

class Snake(gym.Env):
    metadata = {"render_modes": ["human", "rgb_array"], "render_fps": SPEED}

    def __init__(self, width=640, height=480, render_mode=None):
        super(Snake, self).__init__()
        
        self.w = width
        self.h = height
        self.render_mode = render_mode
        
        # DEFINIR ESPACIO DE ACCIONES: 4 direcciones
        self.action_space = spaces.Discrete(4)
        
        # DEFINIR ESPACIO DE OBSERVACIÓN: 11 valores (binarios/floats)
        # · Peligro (frente, izq, der) - 3
        # · Dirección actual (N, S, E, W) - 4
        # · Posición relativa comida (Arriba, Abajo, Izq, Der) - 4
        self.observation_space = spaces.Box(low=0, high=1, shape=(11,), dtype=np.float32)
        
        # Inicializar Pygame si se requiere renderizado
        if self.render_mode is not None:
            pygame.init()
            self.display = pygame.display.set_mode((self.w, self.h))
            pygame.display.set_caption('Snake')
            self.clock = pygame.time.Clock()
        
        self.reset()

    def reset(self, seed=None, options=None):
        super().reset(seed=seed)
        
        self.direction = Action.RIGHT
        self.head = Point(self.w/2, self.h/2)
        self.snake = [self.head,
                      Point(self.head.x - BLOCK_SIZE, self.head.y),
                      Point(self.head.x - (2*BLOCK_SIZE), self.head.y)]
        
        self.score = 0
        self.food = None
        self._place_food()
        self.frame_iteration = 0
        
        return self._get_obs(), {}

    def _place_food(self):
        x = random.randint(0, (self.w - BLOCK_SIZE) // BLOCK_SIZE) * BLOCK_SIZE
        y = random.randint(0, (self.h - BLOCK_SIZE) // BLOCK_SIZE) * BLOCK_SIZE
        self.food = Point(x, y)
        if self.food in self.snake:
            self._place_food()

    def step(self, action_idx):
        self.frame_iteration += 1
        
        # Convertir índice a enum de acción
        # Evitar giro de 180 grados
        new_direction = Action(action_idx)
        if (new_direction == Action.RIGHT and self.direction != Action.LEFT) or \
           (new_direction == Action.LEFT and self.direction != Action.RIGHT) or \
           (new_direction == Action.UP and self.direction != Action.DOWN) or \
           (new_direction == Action.DOWN and self.direction != Action.UP):
            self.direction = new_direction

        # Mover cabeza
        x = self.head.x
        y = self.head.y
        if self.direction == Action.RIGHT:
            x += BLOCK_SIZE
        elif self.direction == Action.LEFT:
            x -= BLOCK_SIZE
        elif self.direction == Action.DOWN:
            y += BLOCK_SIZE
        elif self.direction == Action.UP:
            y -= BLOCK_SIZE
            
        self.head = Point(x, y)
        self.snake.insert(0, self.head)
        
        # Verificar colisión (terminado)
        reward = 0
        terminated = False
        
        if self.is_collision() or self.frame_iteration > 100 * len(self.snake):
            terminated = True
            reward = -10
            return self._get_obs(), reward, terminated, False, {}
            
        # Comer comida o simplemente moverse
        if self.head == self.food:
            self.score += 1
            reward = 10
            self._place_food()
        else:
            self.snake.pop()
            reward = 0 # Recompensa neutral por paso seguro
            
        if self.render_mode == "human":
            self.render()
            
        return self._get_obs(), reward, terminated, False, {}

    def is_collision(self, pt=None):
        if pt is None:
            pt = self.head
        # Bordes
        if pt.x > self.w - BLOCK_SIZE or pt.x < 0 or pt.y > self.h - BLOCK_SIZE or pt.y < 0:
            return True
        # Sí misma
        if pt in self.snake[1:]:
            return True
        return False

    def _get_obs(self):
        head = self.snake[0]
        point_l = Point(head.x - BLOCK_SIZE, head.y)
        point_r = Point(head.x + BLOCK_SIZE, head.y)
        point_u = Point(head.x, head.y - BLOCK_SIZE)
        point_d = Point(head.x, head.y + BLOCK_SIZE)
        
        dir_l = self.direction == Action.LEFT
        dir_r = self.direction == Action.RIGHT
        dir_u = self.direction == Action.UP
        dir_d = self.direction == Action.DOWN

        state = [
            # Peligro en frente
            (dir_r and self.is_collision(point_r)) or 
            (dir_l and self.is_collision(point_l)) or 
            (dir_u and self.is_collision(point_u)) or 
            (dir_d and self.is_collision(point_d)),

            # Peligro a la derecha
            (dir_u and self.is_collision(point_r)) or 
            (dir_d and self.is_collision(point_l)) or 
            (dir_l and self.is_collision(point_u)) or 
            (dir_r and self.is_collision(point_d)),

            # Peligro a la izquierda
            (dir_d and self.is_collision(point_r)) or 
            (dir_u and self.is_collision(point_l)) or 
            (dir_r and self.is_collision(point_u)) or 
            (dir_l and self.is_collision(point_d)),
            
            # Dirección actual
            dir_l,
            dir_r,
            dir_u,
            dir_d,
            
            # Ubicación comida 
            self.food.x < self.head.x,  # comida a la izquierda
            self.food.x > self.head.x,  # comida a la derecha
            self.food.y < self.head.y,  # comida arriba
            self.food.y > self.head.y   # comida abajo
        ]

        return np.array(state, dtype=np.float32)

    def render(self):
        if self.render_mode is None:
            return
            
        self.display.fill(BLACK)
        
        for pt in self.snake:
            pygame.draw.rect(self.display, BLUE1, pygame.Rect(pt.x, pt.y, BLOCK_SIZE, BLOCK_SIZE))
            pygame.draw.rect(self.display, BLUE2, pygame.Rect(pt.x+4, pt.y+4, 12, 12))
            
        pygame.draw.rect(self.display, RED, pygame.Rect(self.food.x, self.food.y, BLOCK_SIZE, BLOCK_SIZE))
        
        # Dibujar puntuación
        # text = font.render(f"Score: {self.score}", True, WHITE)
        # self.display.blit(text, [0, 0])
        
        pygame.display.flip()
        self.clock.tick(SPEED)

    def close(self):
        if self.render_mode is not None:
            pygame.quit()
