# EXERCICIS for -> list comprehension

# Genera una llista dels quadrats dels nombres 1 a 10
llista_nombres_quadrats1 = []
# For
for n in range(1, 11):
    llista_nombres_quadrats1.append(n*n)

print("Amb for")
print(f"Llista de nombres quadrats del 1 fins a 10: {llista_nombres_quadrats1}")

# List comprehension
llista_nombres_quadrats2 = [n*n for n in range(1, 11)]
print("Amb list comprehesion")
print(f"Llista de nombres quadrats del 1 fins a 10: {llista_nombres_quadrats2}\n")

# ----------------------------------------------------------------------------------------------------------------------------------

# Filtrar paraules de 5 o més lletres
paraules = ['patata', 'java', 'data sicence', 'pandas', 'generador', 'integer', 'string', 'python', 'ia']

llista_paraules_cinc_lletres1 = []
# For
for paraula in paraules:
    if len(paraula) >= 5:
        llista_paraules_cinc_lletres1.append(paraula)

print("Amb for")
print(f"Llista de paraules amb longitud mayor o igual a 5: {llista_paraules_cinc_lletres1}")

# List comprehension
llista_paraules_cinc_lletres2 = [paraula for paraula in paraules if len(paraula) >= 5]
print("Amb list comprehesion")
print(f"Llista de paraules amb longitud mayor o igual a 5: {llista_paraules_cinc_lletres2}\n")

# ----------------------------------------------------------------------------------------------------------------------------------

# Extreure la inicial de cada nom d'una llista
noms = ['Paula', 'Juli', 'Diana', 'Pere', 'Gerard', 'Ivan', 'Sara', 'Pol', 'Isaac']

noms_sense_inicial1 = []
# For
for nom in noms:
    noms_sense_inicial1.append(nom[1:])

print("Amb for")
print(f"Llista de noms sense inicial: {noms_sense_inicial1}")

# List comprehension
noms_sense_inicial2 = [nom[1:] for nom in noms]
print("Amb list comprehesion")
print(f"Llista de noms sense inicial: {noms_sense_inicial2}\n")

# ----------------------------------------------------------------------------------------------------------------------------------

# Obtenir els noms que comencin per vocal
usuaris = ['Anna', 'Berta', 'Pol', 'Olga', 'Daniel', 'Iu']
vocals = 'aeiou'

llista_noms_inicia_vocal1 = []

# For
for nom in usuaris:
    for vocal in vocals:
        if nom[0].lower() == vocal:
            llista_noms_inicia_vocal1.append(nom)

print("Amb for")
print(f"Llista de noms que començan amb vocal: {llista_noms_inicia_vocal1}")

# List comprehension
llista_noms_inicia_vocal2 = [nom for nom in usuaris if nom[0].lower() in [v for v in vocals]]
print("Amb list comprehesion")
print(f"Llista de noms que començan amb vocal: {llista_noms_inicia_vocal2}\n")

# ----------------------------------------------------------------------------------------------------------------------------------

# Filtrar els nombres parells més petits de 100
integers = [45, 22, 67, 102, 150, 99, 200, 101, 88, 10]
llista_nombres_parells1 = []
# For
for valor in integers:
    if valor % 2 == 0 and valor < 100:
        llista_nombres_parells1.append(valor)

print("Amb for")
print(f"Llista de nombres parells més petits de 100: {llista_nombres_parells1}")

# List comprehension
llista_nombres_parells2 = [valor for valor in integers if valor % 2 == 0 and valor < 100]
print("Amb list comprehesion")
print(f"Llista de nombres parells més petits de 100: {llista_nombres_parells2}\n")

# ----------------------------------------------------------------------------------------------------------------------------------

# Substituir els elements None d'una llista per un valor per defecte
valors = [-1, 65, 89.67, None, 3, None, 11.00, 3,3333, None]
v_defecte = 0
llista_sense_none1 = []

# For
for valor in valors:
    if valor is None:
        llista_sense_none1.append(v_defecte)
    else:
        llista_sense_none1.append(valor)

print("Amb for")
print(f"Llista de valors sense none: {llista_sense_none1}")

# List comprehension
llista_sense_none2 = [v_defecte if valor is None else valor for valor in valors]
print("Amb list comprehesion")
print(f"Llista de valors sense none: {llista_sense_none2}\n")

# ----------------------------------------------------------------------------------------------------------------------------------

# **TOP DIFICULTAT (no surt a l'exàmen)** 
# Aplanar una llista de llistes (convertir en una llista simple)
dades =[[1,2,3,4],[5,6,7],[8,9],[10]]

llista_simple1 = []
# For
for llista in dades:
    for valor in llista:
        llista_simple1.append(valor)

print("Amb for")
print(f"Llista simple {llista_simple1}")

# List comprehension
llista_simple2 = [valor for llista in dades for valor in llista]
print("Amb list comprehesion")
print(f"Llista simple {llista_simple2}\n")

# ----------------------------------------------------------------------------------------------------------------------------------

# Generar llista de tuples (caràcter, majúscula i repetició x 3)
chars = ['a','b','c']

llista_tuples1 = []
# For
for caracter in chars:
    llista_tmp = [caracter, caracter.upper(), caracter*3]
    llista_tuples1.append(tuple(llista_tmp))

print("Amb for")
print(f"Llista de tuples: {llista_tuples1}")
    
# List comprehension
llista_tuples2 = [(caracter, caracter.upper(), caracter * 3) for caracter in chars]
print("Amb list comprehesion")
print(f"Llista de tuples: {llista_tuples2}\n")

# ----------------------------------------------------------------------------------------------------------------------------------

# Buscar si un nom conté alguna de les vocals d'una llista.
alumnes = ['Anna', 'Berta', 'Pol', 'Olga', 'Daniel', 'Iu']
vocals_in = 'ai'

llista_noms_amb_vocal1 = []
# For
for nom in alumnes:
    for caracter in nom:
        if caracter.lower() in vocals_in:
            llista_noms_amb_vocal1.append(nom)
            break

print("Amb for")
print(f"Llista noms que contenen vocal: {llista_noms_amb_vocal1}")

# List comprehension
llista_noms_amb_vocal2 = [nom for nom in alumnes if any(caracter.lower() in vocals_in for caracter in nom)]
print("Amb list comprehesion")
print(f"Llista noms que contenen vocal: {llista_noms_amb_vocal2}")
