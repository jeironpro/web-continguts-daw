"""
    Joc "pedra, paper o tisores" demana al usuari la seva opció i la maquina tria la seva automaticament, finalment mostra el guanyador
"""
# Importar la biblioteca random per fer servir la funció choice
import random

# Llista d'opcions
opcions = ["pedra", "paper", "tisores"]

# Contadors
guanyades = 0
perdudes = 0
empatades = 0

while True:
    # Demanar l'opció a l'usuari
    jugador1 = input("Jugador 1. tria la teva opció (pedra, paper, tisores): ")

    # Opció de la maquina triada amb random
    jugador2 = random.choice(opcions)

    # Mostrar l'opció triada per la maquina
    print(f"Jugador 2 ha escollit: {jugador2}") 

    # Verificar l'entrada de l'usuari
    if jugador1 not in opcions:
        print("Opció no válida")
    else:
        # Verificar i mostrar el guanyador
        if jugador1 == jugador2:
            empatades += 1
            print("Empat!")
        elif jugador1 == "pedra" and jugador2 == "paper":
            perdudes += 1
            print("Guanya Jugador 2!")
        elif jugador1 == "paper" and jugador2 == "tisores":
            perdudes += 1
            print("Guanya Jugador 2!")
        elif jugador1 == "tisores" and jugador2 == "pedra":
            perdudes += 1
            print("Guanya Jugador 2!")
        else:
            guanyades += 1
            print("Guanya Jugador 1!")

    # Mostrar recomptes
    print(f"Partides guanyades: {guanyades}, perdudes: {perdudes}, empatades: {empatades}.")

    # Demanar si vol continuar jugant
    continuar_jugant = input("Vols jugar una altra partida? (sí/no): ")

    # Comprobar resposta
    if continuar_jugant != "sí":
        print("Adéu! Fins aviat")
        break