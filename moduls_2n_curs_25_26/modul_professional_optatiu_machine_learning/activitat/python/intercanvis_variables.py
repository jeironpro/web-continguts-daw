# Les variables incialment
num1 = int(input("Introdueix el primer nombre (a): "))
num2 = int(input("Introdueix el segon nombre (b): "))
print(f"Els valors inicials són: a = {num1}, b = {num2}")

# Les variables intercanviat fent servir desempaquetat
num1, num2 = num2, num1
print(f"Després de l'intercanvi:: a = {num1}, b = {num2}")

# La suma dels valors
print(f"La suma de {num1} i {num2} és {num1 + num2}")