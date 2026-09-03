# Importar la libreria sys per fer servir la seva funció argv
import sys

# Obtenir el DNI del primer argument introduit
dni = int(sys.argv[1])

# Lletras que pot tenir un DNI
lletras = "TRWAGMYFPDXBNJZSQVHLCKE"

# Calcul per obtenir la posició de lletra
index_lletra = dni % 23

print(f"El DNI complet és: {str(dni) + lletras[index_lletra]}")