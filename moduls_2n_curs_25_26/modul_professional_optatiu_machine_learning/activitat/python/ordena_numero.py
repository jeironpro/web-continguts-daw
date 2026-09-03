""""
    Programa que rebre una seqüència de nombres separats per espais
    i els ordena de manera ascendent i elimina els nombres repetits.
"""

"""
    Algoritme d'ordenació per selecció,
    agafa el valor menor de la llista i el posa a la primera posició, 
    agafa el següent valor menor i el posa a la segona posició, 
    així successivament fins que compara tots els elements.
"""
def ordenacio_seleccio(nombres):
    for i in range(len(nombres)-1):
        menor = i
        for j in range(i+1, len(nombres)):
            if nombres[j] < nombres[menor]:
                menor = j
            
        if menor != i:
            tmp = nombres[i]
            nombres[i] = nombres[menor]
            nombres[menor] = tmp

    return nombres

# Funció que reb una llista de nombres i eliminar els nombres repetits i retorna la llista sense nombres repetits
def eliminar_repetit(nombres):
    for i in range(len(nombres)-1):
        if i < len(nombres)-1:
            if nombres[i] == nombres[i+1]:
                nombres.remove(nombres[i])
    return nombres


while True:
    nombres = input("Introdueix números separat per espais: ") # Demanar els nombres a l'usuari

    # Verifica l'entrada
    if not nombres:
        print("Adéu! Fins aviat")
        break # Surt del bucle

    llista_numeros = nombres.split(" ") # Convertieix els nombres a una llista
    nombres_ordenat = ordenacio_seleccio(llista_numeros) # Ordenar els nombres
    nombres_ordenat_unic = eliminar_repetit(nombres_ordenat) # eliminar repetits de la llista

    print(f"Els nombres únics ordenats son: {nombres_ordenat_unic}") # Ejemplo d'execució