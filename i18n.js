/* ============================================================
   Continguts DAW — internacionalización (i18n)
   ------------------------------------------------------------
   Convenciones de este archivo:
   - Los identificadores van en inglés y los comentarios, en
     español.
   - Los textos de la interfaz se definen aquí por idioma:
     ca (catalán), es (español) y en (inglés).
   - El idioma activo se guarda en localStorage y, si no hay
     preferencia guardada, se detecta el idioma del navegador.
   ============================================================ */

// Idiomas admitidos por la interfaz.
export const LANGS = ["ca", "es", "en"];

// Idioma por defecto cuando no hay preferencia guardada ni el
// navegador coincide con uno de los admitidos.
const DEFAULT_LANG = "ca";

// Regiones usadas para formatear números y fechas por idioma.
const REGIONS = {
    ca: "ca-ES",
    es: "es-ES",
    en: "en-GB",
};

// Clave de localStorage donde se guarda la preferencia de idioma.
const STORAGE_KEY = "continguts-daw-lang";

// Diccionario de textos por idioma. La clave "view.defaultTitle"
// se reutiliza también para el título de la cabecera.
const STRINGS = {
    /* ================= Català ================= */
    ca: {
        "app.brandSub": "CFGS Desenvolupament d'Aplicacions Web · 1r i 2n curs",
        "meta.desc": "Visor dels continguts del CFGS Desenvolupament d'Aplicacions Web (1r i 2n curs).",
        "course.1": "1r curs",
        "course.2": "2n curs",
        "summary.files": "fitxers",
        "summary.formats": "formats",
        "summary.modules": "mòduls",
        "summary.courses": "cursos",
        "summary.material": "de material",
        "tree.allFiles": "Tots els fitxers",
        "tree.aria": "Navegació per cursos i mòduls",
        "view.defaultSubtitle": "Visor dels materials del CFGS Desenvolupament d'Aplicacions Web",
        "view.count.one": "fitxer",
        "view.count.many": "fitxers",
        "format.one": "format",
        "format.many": "formats",
        "module.one": "mòdul",
        "module.many": "mòduls",
        "selectedFormat.one": "format seleccionat",
        "selectedFormat.many": "formats seleccionats",
        "header.acrossCourses": "{count} {label} a tots els cursos",
        "header.searchAppend": "cerca «{query}»",
        "header.searchStandalone": "Cerca: «{query}»",
        "card.viewAria": "Veure {name} ({label})",
        "empty.inventory": "No s'ha pogut carregar l'inventari (data/files.js).",
        "empty.search": "No s'han trobat resultats per a «{query}». Prova amb un altre text o treu filtres.",
        "empty.filters": "No s'han trobat fitxers amb aquests filtres.",
        "empty.reset": "Mostra-ho tot",
        "search.region": "Cerca",
        "search.label": "Cerca per nom, mòdul o format",
        "search.placeholder": "Cerca per nom, mòdul o format…",
        "search.clear": "Neteja la cerca",
        "chips.aria": "Filtrar per format",
        "summary.aria": "Resum",
        "modal.navAria": "Navegació entre fitxers",
        "modal.prev": "Fitxer anterior",
        "modal.next": "Fitxer següent",
        "modal.close": "Tanca",
        "viewer.open": "Obrir en pestanya nova",
        "viewer.download": "Baixar",
        "viewer.loading": "Carregant…",
        "viewer.audioNote": "Àudio {label} · {size}",
        "office.intro": "Aquest format ({label}) no es pot previsualitzar directament al navegador.",
        "office.hint": "Baixa'l i obre'l amb l'aplicació corresponent.",
        "unavailable.title": "El fitxer no és accessible des d'aquesta instal·lació.",
        "unavailable.body": "Els materials no es publiquen al repositori: les targetes només obren els fitxers reals quan la carpeta de materials és accessible des de la mateixa màquina o servidor.",
        "lang.group": "Idioma de la interfície",
        "fmt.pdf": "PDF",
        "fmt.doc": "Word (DOC)",
        "fmt.docx": "Word",
        "fmt.odt": "OpenDocument",
        "fmt.pptx": "PowerPoint",
        "fmt.xlsx": "Excel",
        "fmt.png": "Imatge PNG",
        "fmt.jpg": "Imatge JPG",
        "fmt.svg": "Imatge SVG",
        "fmt.mp3": "Àudio MP3",
        "fmt.md": "Markdown",
        "fmt.txt": "Text",
        "fmt.sql": "SQL",
        "fmt.py": "Python",
        "fmt.js": "JavaScript",
        "fmt.jsx": "JSX (React)",
        "fmt.java": "Java",
        "fmt.css": "CSS",
        "fmt.html": "HTML",
        "fmt.json": "JSON",
        "fmt.xml": "XML",
        "fmt.ipynb": "Notebook",
    },

    /* ================= Español ================= */
    es: {
        "app.brandSub": "CFGS Desarrollo de Aplicaciones Web · 1º y 2º curso",
        "meta.desc": "Visor de los contenidos del CFGS Desarrollo de Aplicaciones Web (1º y 2º curso).",
        "course.1": "1º curso",
        "course.2": "2º curso",
        "summary.files": "archivos",
        "summary.formats": "formatos",
        "summary.modules": "módulos",
        "summary.courses": "cursos",
        "summary.material": "de material",
        "tree.allFiles": "Todos los archivos",
        "tree.aria": "Navegación por cursos y módulos",
        "view.defaultSubtitle": "Visor de los materiales del CFGS Desarrollo de Aplicaciones Web",
        "view.count.one": "archivo",
        "view.count.many": "archivos",
        "format.one": "formato",
        "format.many": "formatos",
        "module.one": "módulo",
        "module.many": "módulos",
        "selectedFormat.one": "formato seleccionado",
        "selectedFormat.many": "formatos seleccionados",
        "header.acrossCourses": "{count} {label} en todos los cursos",
        "header.searchAppend": "búsqueda «{query}»",
        "header.searchStandalone": "Búsqueda: «{query}»",
        "card.viewAria": "Ver {name} ({label})",
        "empty.inventory": "No se ha podido cargar el inventario (data/files.js).",
        "empty.search": "No se han encontrado resultados para «{query}». Prueba con otro texto o quita filtros.",
        "empty.filters": "No se han encontrado archivos con estos filtros.",
        "empty.reset": "Mostrarlo todo",
        "search.region": "Búsqueda",
        "search.label": "Busca por nombre, módulo o formato",
        "search.placeholder": "Busca por nombre, módulo o formato…",
        "search.clear": "Limpiar la búsqueda",
        "chips.aria": "Filtrar por formato",
        "summary.aria": "Resumen",
        "modal.navAria": "Navegación entre archivos",
        "modal.prev": "Archivo anterior",
        "modal.next": "Archivo siguiente",
        "modal.close": "Cerrar",
        "viewer.open": "Abrir en pestaña nueva",
        "viewer.download": "Descargar",
        "viewer.loading": "Cargando…",
        "viewer.audioNote": "Audio {label} · {size}",
        "office.intro": "Este formato ({label}) no se puede previsualizar directamente en el navegador.",
        "office.hint": "Descárgalo y ábrelo con la aplicación correspondiente.",
        "unavailable.title": "El archivo no es accesible desde esta instalación.",
        "unavailable.body": "Los materiales no se publican en el repositorio: las tarjetas solo abren los archivos reales cuando la carpeta de materiales es accesible desde la misma máquina o servidor.",
        "lang.group": "Idioma de la interfaz",
        "fmt.pdf": "PDF",
        "fmt.doc": "Word (DOC)",
        "fmt.docx": "Word",
        "fmt.odt": "OpenDocument",
        "fmt.pptx": "PowerPoint",
        "fmt.xlsx": "Excel",
        "fmt.png": "Imagen PNG",
        "fmt.jpg": "Imagen JPG",
        "fmt.svg": "Imagen SVG",
        "fmt.mp3": "Audio MP3",
        "fmt.md": "Markdown",
        "fmt.txt": "Texto",
        "fmt.sql": "SQL",
        "fmt.py": "Python",
        "fmt.js": "JavaScript",
        "fmt.jsx": "JSX (React)",
        "fmt.java": "Java",
        "fmt.css": "CSS",
        "fmt.html": "HTML",
        "fmt.json": "JSON",
        "fmt.xml": "XML",
        "fmt.ipynb": "Notebook",
    },

    /* ================= English ================= */
    en: {
        "app.brandSub": "CFGS Web Application Development · 1st and 2nd year",
        "meta.desc": "Viewer for the contents of the CFGS Web Application Development (1st and 2nd year).",
        "course.1": "1st year",
        "course.2": "2nd year",
        "summary.files": "files",
        "summary.formats": "formats",
        "summary.modules": "modules",
        "summary.courses": "courses",
        "summary.material": "of materials",
        "tree.allFiles": "All files",
        "tree.aria": "Browse by courses and modules",
        "view.defaultSubtitle": "Viewer for the materials of the CFGS Web Application Development",
        "view.count.one": "file",
        "view.count.many": "files",
        "format.one": "format",
        "format.many": "formats",
        "module.one": "module",
        "module.many": "modules",
        "selectedFormat.one": "selected format",
        "selectedFormat.many": "selected formats",
        "header.acrossCourses": "{count} {label} across all courses",
        "header.searchAppend": "search “{query}”",
        "header.searchStandalone": "Search: “{query}”",
        "card.viewAria": "View {name} ({label})",
        "empty.inventory": "The inventory could not be loaded (data/files.js).",
        "empty.search": "No results found for “{query}”. Try a different text or remove the filters.",
        "empty.filters": "No files found with these filters.",
        "empty.reset": "Show everything",
        "search.region": "Search",
        "search.label": "Search by name, module or format",
        "search.placeholder": "Search by name, module or format…",
        "search.clear": "Clear search",
        "chips.aria": "Filter by format",
        "summary.aria": "Summary",
        "modal.navAria": "Browse between files",
        "modal.prev": "Previous file",
        "modal.next": "Next file",
        "modal.close": "Close",
        "viewer.open": "Open in new tab",
        "viewer.download": "Download",
        "viewer.loading": "Loading…",
        "viewer.audioNote": "Audio {label} · {size}",
        "office.intro": "This format ({label}) cannot be previewed directly in the browser.",
        "office.hint": "Download it and open it with the appropriate application.",
        "unavailable.title": "This file is not accessible from this installation.",
        "unavailable.body": "Materials are not published in the repository: cards only open the real files when the materials folder is accessible from the same machine or server.",
        "lang.group": "Interface language",
        "fmt.pdf": "PDF",
        "fmt.doc": "Word (DOC)",
        "fmt.docx": "Word",
        "fmt.odt": "OpenDocument",
        "fmt.pptx": "PowerPoint",
        "fmt.xlsx": "Excel",
        "fmt.png": "PNG image",
        "fmt.jpg": "JPG image",
        "fmt.svg": "SVG image",
        "fmt.mp3": "MP3 audio",
        "fmt.md": "Markdown",
        "fmt.txt": "Text",
        "fmt.sql": "SQL",
        "fmt.py": "Python",
        "fmt.js": "JavaScript",
        "fmt.jsx": "JSX (React)",
        "fmt.java": "Java",
        "fmt.css": "CSS",
        "fmt.html": "HTML",
        "fmt.json": "JSON",
        "fmt.xml": "XML",
        "fmt.ipynb": "Notebook",
    },
};

// Lee la preferencia guardada o detecta el idioma del navegador.
const detectLanguage = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && LANGS.includes(saved)) return saved;
    } catch (_) {
        // Sin acceso a localStorage (modo privado): se sigue con
        // la detección del navegador.
    }
    if (typeof navigator !== "undefined") {
        const firstPart = (navigator.language || "").split("-")[0].toLowerCase();
        if (LANGS.includes(firstPart)) return firstPart;
    }
    return DEFAULT_LANG;
};

// Idioma activo de la interfaz (cambia al pulsar el selector).
let currentLang = detectLanguage();

// Devuelve el idioma activo ("ca", "es" o "en").
export const current = () => currentLang;

// Devuelve la región usada para formatear números del idioma.
export const locale = () => REGIONS[currentLang] || REGIONS[DEFAULT_LANG];

// Cambia el idioma activo y guarda la preferencia; devuelve true
// si el idioma solicitado es válido.
export const setLanguage = (lang) => {
    if (!LANGS.includes(lang)) return false;
    currentLang = lang;
    try {
        localStorage.setItem(STORAGE_KEY, lang);
    } catch (_) {
        // Sin acceso a localStorage: el cambio aplica en memoria.
    }
    return true;
};

// Traduce una clave al idioma activo y sustituye las variables
// {name} por su valor (si se pasan). Sin variable: clave o ca.
export const translate = (key, vars) => {
    const table = STRINGS[currentLang] || STRINGS[DEFAULT_LANG];
    let text = table[key];
    if (text == null) text = STRINGS[DEFAULT_LANG][key];
    if (text == null) text = key;
    if (vars) {
        text = text.replace(/\{(\w+)\}/g, (match, name) =>
            vars[name] != null ? vars[name] : match
        );
    }
    return text;
};
