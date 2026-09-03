# web-continguts-daw

Visor web estático para los materiales docentes del CFGS de Desarrollo de Aplicaciones Web (1r y 2n curs). La interfaz se inspira en el estilo visual de depobudget (neobrutalismo): fondo crema, tinta casi negra, bordes marcados y sombras duras.

## Descripción

La aplicación presenta un inventario de los ficheros de los materiales (organizados por curso, módulo y formato) en una cuadrícula de tarjetas. Permite navegar desde un panel lateral, buscar por nombre, módulo o formato, filtrar por tipo de fichero y previsualizar cada archivo en un modal (PDF, imágenes, audio, Markdown, código, texto y fichas para formatos de Office).

Está construida con HTML, CSS y JavaScript en módulos ES, sin dependencias externas ni paso de compilación.

## Características

- Navegación por cursos, módulos y formatos desde el panel lateral.
- Tarjetas cuadradas uniformes con el módulo y el nombre del fichero.
- Buscador con resaltado de coincidencias y atajo de teclado.
- Filtros combinables por formato (chips de color).
- Visor de ficheros en modal con navegación entre resultados.
- Interfaz en catalán, español e inglés con selector de idioma.
- Diseño responsive (mobile-first).

## Idiomas de la interfaz

El selector de idioma del panel lateral (CA / ES / EN) cambia todos los textos de la interfaz. La preferencia se guarda en el navegador y, si no existe, se detecta el idioma del navegador.

Los textos se cargan desde archivos JSON separados por idioma en la carpeta `lang/`:

- `lang/ca.json` (catalán)
- `lang/es.json` (español)
- `lang/en.json` (inglés)

Para traducir o ajustar un texto solo hay que editar el JSON correspondiente; no hace falta tocar el código. Los nombres de los ficheros y de los módulos del material se mantienen intactos.

## Uso

La web usa módulos ES (import/export), por lo que hay que servirla por HTTP y no se puede abrir `index.html` directamente con doble clic.

El inventario de ficheros (`data/files.js`) se genera a partir de la carpeta de materiales del profesorado, que no forma parte de este repositorio. Las tarjetas abren los ficheros reales solo cuando la carpeta de materiales es accesible desde la misma máquina o servidor.

Para servir la web y los materiales desde una misma carpeta raíz:

1. Ejecuta un servidor estático en una carpeta que contenga tanto la web como los materiales (por ejemplo, la carpeta raíz del usuario):

   ```bash
   cd ~ && python3 -m http.server 8000
   ```

2. Abre `http://localhost:8000/.../web-continguts-daw/` en el navegador.

3. Si los materiales están en otra ubicación, edita la constante `MATERIAL_DIRS` de `app.js` para indicar la ruta correcta.

### Regenerar el inventario

Cuando cambien los materiales, regenera el inventario con:

```bash
python3 tools/generate_inventory.py --materials /ruta/a/la/carpeta/de/materials
```

El generador no copia los ficheros: solo crea el catálogo con sus metadatos.

## Estructura del proyecto

| Ruta | Descripción |
| --- | --- |
| `index.html` | Estructura de la página (panel lateral, buscador, cuadrícula y modal). |
| `styles.css` | Hoja de estilos con el sistema de diseño depobudget. |
| `app.js` | Lógica de la aplicación (navegación, filtros, visor). |
| `i18n.js` | Carga de diccionarios y helpers de traducción. |
| `lang/` | Diccionarios JSON de textos por idioma (ca, es, en). |
| `data/files.js` | Inventario generado de ficheros de los materiales. |
| `tools/generate_inventory.py` | Generador del inventario a partir de la carpeta de materiales. |
| `favicon.svg` | Icono de la página y de la marca del panel lateral. |

## Licencia

Este proyecto se distribuye bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.
