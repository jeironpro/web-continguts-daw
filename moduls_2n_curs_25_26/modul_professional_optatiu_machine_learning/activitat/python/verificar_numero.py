"""
    Programa que rep un valor per pantalla i verifica si és un enter o un decimal vàlid, després, mostra si és un valor positiu, negatiu o zero.
"""

# Funció que verifica si el número és un enter
def es_enter(cadena):
    for i in range(len(cadena)):
        caracter = cadena[i]

        if len(cadena) > 1 and i == 0 and caracter == "+" or caracter == "-":
            if not cadena[i+1].isdigit():
                return False
        elif not caracter.isdigit():
            return False
    return True

# Funció que verifica si el número és un decimal
def es_decimal(cadena):
    puntFlotant = False

    if not cadena[0].isdigit() and cadena[0] != "+" and cadena[0] != "-":
        return False
    
    for i in range(1, len(cadena), 1):
        caracter = cadena[i]

        if i < len(cadena) - 1 and caracter  == ".":
            if puntFlotant:
                return False
            puntFlotant = True
        elif not caracter.isdigit():
            return False
    return puntFlotant

# Funció que retorna el valor convertit a enter o decimal segons correspongui
def valor_convertit(cadena):
    if es_enter(cadena):
        # Retorna el valor convertir a un enter
        return int(cadena)
    elif es_decimal(cadena):
        # Retorna el valor convertir a un decimal
        return float(cadena)
    return None

# Rebre el valor de l'usuari
valor_usuari = input("Introdueix un número: ")

# Valor convertit
valor = valor_convertit(valor_usuari)

# Verficar si el valor és un enter o un decimal
if valor is None:
    print("Entrada no válida")
else:
    # Verificar si és positiu, negatiu o zero
    if valor > 0:
        print("El número és positiu")
    elif valor < 0:
        print("El número és negatiu")
    else:
        print("El número és zero")