# web-continguts-daw

## 📌 Descripción
Este proyecto forma parte de mi portafolio personal.  
El objetivo es demostrar buenas prácticas de programación, organización y documentación en GitHub.

## 🚀 Ús

La web és estàtica (HTML + CSS + JS, sense dependències) i fa servir
**mòduls ES** (`import`/`export`), així que cal servir-la per HTTP:
no funciona obrir `index.html` directament amb un doble clic.

L'inventari de fitxers (`data/files.js`) es genera a partir de la carpeta de
materials del professorat, que **no** forma part d'aquest repositori; les targetes
obren els fitxers reals només quan els materials són accessibles des de la
mateixa màquina/servidor.

1. Serveix amb un servidor estàtic una carpeta que contingui tant la web com
   els materials (per exemple, la carpeta arrel de l'usuari):

   ```bash
   cd ~ && python3 -m http.server 8000
   ```

2. Obre `http://localhost:8000/.../web-continguts-daw/`.

3. Si els materials estan en una altra ubicació, edita la constant `MATERIAL_DIRS`
   a `app.js` per indicar la ruta correcta.

Per regenerar l'inventari quan canviïn els materials:

```bash
python3 tools/generate_inventory.py --materials /ruta/a/la/carpeta/de/materials
```

## 📜 Licencia
Este proyecto está bajo la licencia **MIT**.  
Consulta el archivo [LICENSE](LICENSE) para más detalles.
