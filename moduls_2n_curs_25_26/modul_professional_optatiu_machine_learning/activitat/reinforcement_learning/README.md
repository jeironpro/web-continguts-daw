# Proyecto Snake RL - Agente DQN

Este proyecto implementa un agente de Reinforcement Learning utilizando el algoritmo Deep Q-Network (DQN) para jugar al clásico juego Snake.

## Requerimientos de Dependencias

Para ejecutar este proyecto, necesitas tener Python instalado y las siguientes dependencias:

- `gymnasium`
- `pygame`
- `torch`
- `numpy`
- `matplotlib`

## Instalación

Puedes instalar todas las dependencias necesarias utilizando el archivo `requirements.txt` incluido:

```bash
pip install -r requirements.txt
```

## Estructura del Proyecto

- `snake.py`: Definición del entorno del juego compatible con Gymnasium.
- `agente.py`: Implementación del agente DQN (Dueling y Double DQN).
- `Espinal_Jeiron_RL_Practica.ipynb`: Notebook con el proceso de entrenamiento y análisis.
- `ver_agente.py`: Script para visualizar al agente entrenado.
- `best_snake_model.pth`: Pesos del mejor modelo entrenado.
