/* ============================================================
   Continguts DAW — lògica de l'aplicació
   ============================================================ */
import { FITXERS } from "./data/fitxers.js";

/* ------------------------------------------------------------
   Constants
   ------------------------------------------------------------ */
const CURSA = {
  1: { nom: "1r curs", carpeta: "moduls_1er_curs_24_25" },
  2: { nom: "2n curs", carpeta: "moduls_2n_curs_25_26" },
};

/* Taula de formats: etiqueta, color (paleta depobudget) i categoria de visor */
const FORMATS = {
  pdf: { label: "PDF", color: "#d95c5c", cat: "pdf" },
  doc: { label: "Word (DOC)", color: "#4a9fd4", cat: "office" },
  docx: { label: "Word", color: "#1769e8", cat: "office" },
  odt: { label: "OpenDocument", color: "#3cbdb1", cat: "office" },
  pptx: { label: "PowerPoint", color: "#f5b83c", cat: "office" },
  xlsx: { label: "Excel", color: "#c8e832", cat: "office" },
  png: { label: "Imatge PNG", color: "#7c3aed", cat: "image" },
  jpg: { label: "Imatge JPG", color: "#ff5b45", cat: "image" },
  svg: { label: "Imatge SVG", color: "#4a9fd4", cat: "image" },
  mp3: { label: "Àudio MP3", color: "#7c3aed", cat: "audio" },
  md: { label: "Markdown", color: "#3cbdb1", cat: "text" },
  txt: { label: "Text", color: "#f5b83c", cat: "text" },
  sql: { label: "SQL", color: "#1769e8", cat: "code" },
  py: { label: "Python", color: "#4a9fd4", cat: "code" },
  js: { label: "JavaScript", color: "#f5b83c", cat: "code" },
  jsx: { label: "JSX (React)", color: "#c8e832", cat: "code" },
  java: { label: "Java", color: "#ff5b45", cat: "code" },
  css: { label: "CSS", color: "#7c3aed", cat: "code" },
  html: { label: "HTML", color: "#ff5b45", cat: "code" },
  json: { label: "JSON", color: "#f5b83c", cat: "code" },
  xml: { label: "XML", color: "#3cbdb1", cat: "code" },
  ipynb: { label: "Notebook", color: "#1769e8", cat: "code" },
};
const PALETA = ["#1769e8", "#ff5b45", "#7c3aed", "#4a9fd4", "#c8e832", "#f5b83c", "#3cbdb1", "#d95c5c"];
const INK_ON = new Set(["#c8e832", "#f5b83c"]); // colors clars: text fosc

const KEYS = Object.freeze({
  BARRA: "/",
  ESCAPE: "Escape",
  FLETXA_ESQUERRA: "ArrowLeft",
  FLETXA_DRETA: "ArrowRight",
});

const DEBOUNCE_MS = 120;
const TEXT_PREVIEW_MAX = 1_500_000; // límit de mida per mostrar text/codi via fetch
const NS_SVG = "http://www.w3.org/2000/svg";

/* Candidats per localitzar la carpeta de materials (la web pot viure
   fora d'ella; els fitxers no es publiquen al repositori). */
const MATERIALS_CANDIDATES = [
  "../../../Descargas/desenvolupament_aplicacions_web",
  "../Descargas/desenvolupament_aplicacions_web",
  "/Descargas/desenvolupament_aplicacions_web",
  "",
];

/* ------------------------------------------------------------
   Utilitats
   ------------------------------------------------------------ */
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

const infoFormat = (ext) => {
  const conegut = FORMATS[ext];
  if (conegut) return conegut;
  let suma = 0;
  for (const ch of ext) suma += ch.charCodeAt(0);
  return { label: ext.toUpperCase(), color: PALETA[suma % PALETA.length], cat: "fitxer" };
};

const formatBytes = (bytes) => {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  const unitats = ["B", "KB", "MB", "GB"];
  let valor = bytes;
  let i = 0;
  while (valor >= 1024 && i < unitats.length - 1) {
    valor /= 1024;
    i += 1;
  }
  const digits = valor >= 100 || i === 0 ? 0 : 1;
  return `${valor.toFixed(digits).replace(".", ",")} ${unitats[i]}`;
};

const normalitza = (s) =>
  String(s)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const textColorSobre = (color) => (INK_ON.has(color) ? "var(--ink)" : "#ffffff");

/* ------------------------------------------------------------
   Constructors de DOM (renderitzat segur, sense innerHTML)
   ------------------------------------------------------------ */
const crea = (tag, atrs = {}, fills = []) => {
  const el = document.createElement(tag);
  for (const [nom, valor] of Object.entries(atrs)) {
    if (valor == null || valor === false) continue;
    if (nom === "class") el.className = valor;
    else if (nom === "text") el.textContent = String(valor);
    else if (nom === "style") {
      for (const [prop, v] of Object.entries(valor)) el.style.setProperty(prop, v);
    } else if (nom === "dataset") Object.assign(el.dataset, valor);
    else if (nom === "disabled") el.disabled = true;
    else if (nom === "href") el.href = String(valor);
    else if (nom === "download") el.setAttribute("download", String(valor));
    else el.setAttribute(nom, valor === true ? "" : String(valor));
  }
  omple(el, fills);
  return el;
};

const omple = (pare, fills) => {
  const llista = Array.isArray(fills) ? fills : [fills];
  for (const fill of llista) {
    if (fill == null || fill === false) continue;
    pare.append(fill instanceof Node ? fill : document.createTextNode(String(fill)));
  }
  return pare;
};

const creaSvg = (tag, atrs = {}, fills = []) => {
  const el = document.createElementNS(NS_SVG, tag);
  for (const [nom, valor] of Object.entries(atrs)) {
    if (valor == null || valor === false) continue;
    el.setAttribute(nom, String(valor));
  }
  for (const fill of fills) if (fill) el.append(fill);
  return el;
};

const iconaGraella = () =>
  creaSvg("svg", { class: "tree-ico", viewBox: "0 0 16 16", "aria-hidden": "true" }, [
    creaSvg("rect", { x: 1, y: 1, width: 6, height: 6, fill: "none", stroke: "currentColor", "stroke-width": 2 }),
    creaSvg("rect", { x: 9, y: 1, width: 6, height: 6, fill: "none", stroke: "currentColor", "stroke-width": 2 }),
    creaSvg("rect", { x: 1, y: 9, width: 6, height: 6, fill: "none", stroke: "currentColor", "stroke-width": 2 }),
    creaSvg("rect", { x: 9, y: 9, width: 6, height: 6, fill: "none", stroke: "currentColor", "stroke-width": 2 }),
  ]);

const iconaCaret = () =>
  creaSvg("svg", { class: "caret", viewBox: "0 0 12 12", "aria-hidden": "true" }, [
    creaSvg("path", {
      d: "M3 1.5 8.5 6 3 10.5",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": 2.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    }),
  ]);

/* Afegeix text a un contenidor; si hi ha cerca, marca les coincidències */
const marcaText = (contenidor, text, cerca) => {
  if (!cerca) {
    contenidor.append(text);
    return;
  }
  const re = new RegExp(`(${escRe(cerca)})`, "ig");
  let ultim = 0;
  let m;
  while ((m = re.exec(String(text)))) {
    if (m.index > ultim) contenidor.append(String(text).slice(ultim, m.index));
    contenidor.append(crea("mark", {}, [m[0]]));
    ultim = m.index + m[0].length;
  }
  contenidor.append(String(text).slice(ultim));
};

/* ------------------------------------------------------------
   Ruta de materials (sondatge de candidats)
   ------------------------------------------------------------ */
const encamina = (rel) => rel.split("/").map(encodeURIComponent).join("/");

const materialsInfo = (async () => {
  if (FITXERS.length === 0) return { base: "", ok: false };
  const mostra = FITXERS[0].rel;
  for (const cand of MATERIALS_CANDIDATES) {
    const url = `${cand.replace(/\/$/, "")}/${encamina(mostra)}`;
    try {
      const r = await fetch(url, { method: "HEAD" });
      if (r.ok) return { base: cand.replace(/\/$/, ""), ok: true };
    } catch (_) {
      /* prova el següent candidat */
    }
  }
  return { base: "", ok: false };
})();

/* ------------------------------------------------------------
   Estat de navegació i filtratge
   ------------------------------------------------------------ */
const estat = {
  curs: null, // 1 | 2 | null
  modul: null, // modulId | null
  formats: new Set(), // extensions seleccionades
  q: "", // text de cerca
};

const resetNavegacio = () => {
  estat.curs = null;
  estat.modul = null;
  estat.formats.clear();
};

const clauModul = (curs, modulId) => `${curs}|${modulId}`;

let llistaActual = [];
let idxActual = -1;
let peticio = 0; // token per cancel·lar renders del visor en curs

/* ------------------------------------------------------------
   Índexs sobre l'inventari
   ------------------------------------------------------------ */
const modulsPerCurs = { 1: [], 2: [] };
const vistos = new Set();
for (const f of FITXERS) {
  const clau = clauModul(f.curs, f.modulId);
  if (!vistos.has(clau)) {
    vistos.add(clau);
    modulsPerCurs[f.curs].push({
      curs: f.curs,
      id: f.modulId,
      codi: f.codi,
      label: f.modul,
      n: 0,
      formats: {},
    });
  }
}
const perModul = new Map();
for (const llista of Object.values(modulsPerCurs)) {
  for (const m of llista) perModul.set(clauModul(m.curs, m.id), m);
}
for (const f of FITXERS) {
  const m = perModul.get(clauModul(f.curs, f.modulId));
  m.n += 1;
  m.formats[f.ext] = (m.formats[f.ext] || 0) + 1;
}
for (const llista of Object.values(modulsPerCurs)) {
  for (const m of llista) {
    m.exts = Object.keys(m.formats).sort((a, b) => m.formats[b] - m.formats[a] || a.localeCompare(b));
  }
}

const modulDe = (curs, id) => perModul.get(clauModul(curs, id));

/* ------------------------------------------------------------
   Filtratge (navegació + formats + cerca)
   ------------------------------------------------------------ */
const llistaContext = () =>
  FITXERS.filter(
    (f) =>
      (estat.curs === null || f.curs === estat.curs) && (estat.modul === null || f.modulId === estat.modul)
  );

const filtra = () => {
  const q = normalitza(estat.q.trim());
  return llistaContext().filter((f) => {
    if (estat.formats.size > 0 && !estat.formats.has(f.ext)) return false;
    if (q) {
      const pal = [f.nom, f.modul, infoFormat(f.ext).label, f.ext, f.codi].map(normalitza).join(" ");
      if (!pal.includes(q)) return false;
    }
    return true;
  });
};

/* ------------------------------------------------------------
   Render del resum d'estadístiques (una sola vegada)
   ------------------------------------------------------------ */
const renderResum = () => {
  const seccio = $("#summary");
  seccio.textContent = "";

  const numCursos = new Set(FITXERS.map((f) => f.curs)).size;
  const numModuls = new Set(FITXERS.map((f) => clauModul(f.curs, f.modulId))).size;
  const numFormats = new Set(FITXERS.map((f) => f.ext)).size;
  const midaTotal = FITXERS.reduce((acc, f) => acc + (f.mida || 0), 0);

  const dades = [
    { num: FITXERS.length.toLocaleString("ca-ES"), label: "fitxers" },
    { num: numFormats.toLocaleString("ca-ES"), label: "formats" },
    { num: numModuls.toLocaleString("ca-ES"), label: "mòduls" },
    { num: numCursos.toLocaleString("ca-ES"), label: "cursos" },
    { num: formatBytes(midaTotal), label: "de material" },
  ];

  for (const d of dades) {
    const article = crea("article", { class: "stat" }, [
      crea("span", { class: "stat-num", text: d.num }),
      crea("span", { class: "stat-label", text: d.label }),
    ]);
    seccio.append(article);
  }
};

/* ------------------------------------------------------------
   Arbre de navegació (sidebar)
   ------------------------------------------------------------ */
const construirArbre = (arbre) => {
  arbre.textContent = "";

  const botoArrel = crea(
    "button",
    { type: "button", class: "tree-btn root-btn", dataset: { act: "root" }, "aria-current": "true" },
    [
      iconaGraella(),
      crea("span", { class: "tree-lbl", text: "Tots els fitxers" }),
      crea("span", { class: "tree-count", text: String(FITXERS.length) }),
    ]
  );
  arbre.append(botoArrel, crea("div", { class: "tree-sep", role: "presentation" }));

  for (const curs of [1, 2]) {
    const moduls = modulsPerCurs[curs];
    const total = moduls.reduce((acc, m) => acc + m.n, 0);

    const seccio = crea("section", { class: "curs", dataset: { curs: String(curs) } });
    const cap = crea(
      "button",
      {
        type: "button",
        class: "tree-btn curs-btn",
        dataset: { act: "curs", curs: String(curs) },
        "aria-expanded": "false",
      },
      [iconaCaret(), crea("span", { class: "tree-lbl", text: CURSA[curs].nom }), crea("span", { class: "tree-count", text: String(total) })]
    );
    const cos = crea("div", { class: "curs-body" });

    for (const m of moduls) {
      const fillsModul = [];
      if (m.codi) fillsModul.push(crea("span", { class: "tree-codi", text: m.codi }));
      fillsModul.push(
        crea("span", { class: "tree-lbl", text: m.label }),
        crea("span", { class: "tree-count", text: String(m.n) })
      );
      cos.append(
        crea(
          "button",
          {
            type: "button",
            class: "tree-btn modul-btn",
            dataset: { act: "modul", curs: String(curs), modul: m.id },
          },
          fillsModul
        )
      );

      const llistaFormats = crea("div", { class: "fmt-list" });
      for (const ext of m.exts) {
        const info = infoFormat(ext);
        llistaFormats.append(
          crea(
            "button",
            {
              type: "button",
              class: "tree-btn fmt-btn",
              dataset: { act: "format", curs: String(curs), modul: m.id, ext },
            },
            [
              crea("span", { class: "dot", style: { "--c": info.color }, "aria-hidden": "true" }),
              crea("span", { class: "tree-lbl", text: info.label }),
              crea("span", { class: "tree-count", text: String(m.formats[ext]) }),
            ]
          )
        );
      }
      cos.append(llistaFormats);
    }

    seccio.append(cap, cos);
    arbre.append(seccio);
  }
};

const obraCurs = (arbre, curs, obert) => {
  const seccio = arbre.querySelector(`.curs[data-curs="${curs}"]`);
  if (!seccio) return;
  seccio.classList.toggle("open", obert);
  const btn = seccio.querySelector(".curs-btn");
  btn.setAttribute("aria-expanded", obert ? "true" : "false");
};

const actualitzaArbre = (arbre) => {
  for (const b of $$("[data-act]", arbre)) {
    const actiu =
      (b.dataset.act === "root" && estat.curs === null) ||
      (b.dataset.act === "curs" && estat.curs === Number(b.dataset.curs)) ||
      (b.dataset.act === "modul" &&
        estat.curs === Number(b.dataset.curs) &&
        estat.modul === b.dataset.modul) ||
      (b.dataset.act === "format" &&
        estat.curs === Number(b.dataset.curs) &&
        estat.modul === b.dataset.modul &&
        estat.formats.has(b.dataset.ext));
    b.classList.toggle("active", actiu);
    if (b.dataset.act === "root") b.setAttribute("aria-current", actiu ? "true" : "false");
  }
  for (const curs of [1, 2]) obraCurs(arbre, curs, estat.curs === curs);
};

const clicArbre = (arbre, e) => {
  const btn = e.target.closest("[data-act]");
  if (!btn || !arbre.contains(btn)) return;
  const act = btn.dataset.act;
  const curs = Number(btn.dataset.curs);

  if (act === "root") {
    resetNavegacio();
  } else if (act === "curs") {
    const seccio = btn.closest(".curs");
    if (estat.curs === curs && estat.modul === null && seccio.classList.contains("open")) {
      obraCurs(arbre, curs, false); // replega sense canviar la selecció
      actualitzaArbre(arbre);
      return;
    }
    estat.curs = curs;
    estat.modul = null;
    estat.formats.clear();
    obraCurs(arbre, curs, true);
  } else if (act === "modul") {
    estat.curs = curs;
    estat.modul = btn.dataset.modul;
    estat.formats.clear();
    obraCurs(arbre, curs, true);
    btn.scrollIntoView({ block: "nearest" });
  } else if (act === "format") {
    estat.curs = curs;
    estat.modul = btn.dataset.modul;
    estat.formats = new Set([btn.dataset.ext]);
    obraCurs(arbre, curs, true);
    btn.scrollIntoView({ block: "nearest" });
  }
  actualitzaArbre(arbre);
  renderVista();
};

/* ------------------------------------------------------------
   Capçalera de vista, chips i graella
   ------------------------------------------------------------ */
const renderMeta = (llista) => {
  const títol = $("#viewTitle");
  const sub = $("#viewSub");
  const count = $("#viewCount");

  const seleccionats = [...estat.formats];
  const nSel = seleccionats.length;
  const titolFormats = () => seleccionats.map((ext) => infoFormat(ext).label).sort().join(" + ");
  const plural = (n, s1, sn) => (n === 1 ? s1 : sn);

  let titolText = "Tots els fitxers";
  let subText = "";

  if (estat.modul && nSel > 0) {
    titolText = titolFormats();
    subText = `${CURSA[estat.curs].nom} · ${modulDe(estat.curs, estat.modul).label}`;
  } else if (estat.modul) {
    const m = modulDe(estat.curs, estat.modul);
    titolText = m.label;
    subText = `${CURSA[estat.curs].nom} · ${m.exts.length} ${plural(m.exts.length, "format", "formats")}`;
  } else if (estat.curs) {
    titolText = CURSA[estat.curs].nom;
    subText = `${modulsPerCurs[estat.curs].length} ${plural(modulsPerCurs[estat.curs].length, "mòdul", "mòduls")}`;
    if (nSel > 0) subText += ` · ${nSel} ${plural(nSel, "format seleccionat", "formats seleccionats")}`;
  } else if (nSel > 0) {
    titolText = titolFormats();
    subText = `${nSel} ${plural(nSel, "format seleccionat", "formats seleccionats")} a tots els cursos`;
  } else {
    subText = "Visor dels materials del CFGS Desenvolupament d'Aplicacions Web";
  }

  if (estat.q) subText = subText ? `${subText} · cerca «${estat.q.trim()}»` : `Cerca: «${estat.q.trim()}»`;

  títol.textContent = titolText;
  sub.textContent = subText;
  count.textContent = `${llista.length.toLocaleString("ca-ES")} fitxers`;
};

const renderChips = (llista) => {
  const chips = $("#chips");
  chips.textContent = "";

  const comptes = {};
  for (const f of llista) comptes[f.ext] = (comptes[f.ext] || 0) + 1;
  const exts = Object.keys(comptes).sort(
    (a, b) => comptes[b] - comptes[a] || infoFormat(a).label.localeCompare(infoFormat(b).label)
  );

  for (const ext of exts) {
    const info = infoFormat(ext);
    const actiu = estat.formats.has(ext);
    chips.append(
      crea(
        "button",
        {
          type: "button",
          class: `chip${actiu ? " active" : ""}`,
          dataset: { ext },
          style: { "--c": info.color },
          "aria-pressed": actiu ? "true" : "false",
        },
        [
          crea("span", { class: "chip-dot", "aria-hidden": "true" }),
          crea("span", { class: "chip-lbl", text: info.label }),
          crea("span", { class: "chip-count", text: String(comptes[ext]) }),
        ]
      )
    );
  }
};

const renderGraella = (llista) => {
  const grid = $("#grid");
  grid.textContent = "";
  const q = estat.q.trim();

  llista.forEach((f, i) => {
    const info = infoFormat(f.ext);
    const colorText = textColorSobre(info.color);

    const modul = crea("span", { class: "card-modul" });
    marcaText(modul, f.modul, q);
    const nom = crea("span", { class: "card-nom" });
    marcaText(nom, f.nom, q);

    const carta = crea(
      "button",
      {
        type: "button",
        class: "card",
        dataset: { i: String(i), ext: f.ext },
        title: `${f.nom} · ${f.modul}`,
        "aria-label": `Veure ${f.nom} (${info.label})`,
      },
      [
        crea("span", { class: "card-visual", style: { "--c": info.color, "--tc": colorText } }, [
          crea("span", { class: "card-ext", text: info.label }),
          crea("span", { class: "card-size", text: formatBytes(f.mida) }),
        ]),
        crea("span", { class: "card-foot" }, [modul, nom]),
      ]
    );
    grid.append(carta);
  });
};

const renderBuit = (llista) => {
  const buit = $("#empty");
  if (llista.length === 0) {
    buit.classList.remove("hidden");
    const msg = $("#emptyMsg");
    if (FITXERS.length === 0) {
      msg.textContent = "No s'ha pogut carregar l'inventari (data/fitxers.js).";
    } else if (estat.q) {
      msg.textContent = `No s'han trobat resultats per a «${estat.q.trim()}». Prova amb un altre text o treu filtres.`;
    } else {
      msg.textContent = "No s'han trobat fitxers amb aquests filtres.";
    }
  } else {
    buit.classList.add("hidden");
  }
};

const renderVista = () => {
  llistaActual = filtra();
  renderMeta(llistaActual);
  renderChips(llistaContext());
  renderGraella(llistaActual);
  renderBuit(llistaActual);
};

/* ------------------------------------------------------------
   Visor de fitxers (modal)
   ------------------------------------------------------------ */
const contingutNoDisponible = (f) =>
  crea("div", { class: "alert" }, [
    crea("p", {}, [crea("strong", { text: "El fitxer no és accessible des d'aquesta instal·lació." })]),
    crea("p", {
      text: "Els materials no es publiquen al repositori: les targetes només obren els fitxers reals quan la carpeta de materials és accessible des de la mateixa màquina o servidor.",
    }),
  ]);

const contingutOffice = (info) => {
  const textColor = textColorSobre(info.color);
  return crea("div", { class: "office" }, [
    crea("div", { class: "office-icon", style: { "--c": info.color, "--tc": textColor } }, [
      crea("span", { text: info.label }),
    ]),
    crea("div", { class: "office-text" }, [
      crea("p", { text: `Aquest format (${info.label}) no es pot previsualitzar directament al navegador.` }),
      crea("p", { class: "office-hint", text: "Baixa'l i obre'l amb l'aplicació corresponent." }),
    ]),
  ]);
};

const hrefSegur = (url) => {
  const t = String(url).trim();
  if (/^(javascript|data|vbscript):/i.test(t)) return null;
  return t;
};

/* Render de Markdown cap a nodes DOM */
const fragmentsInline = (text) => {
  const resultats = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g;
  let ultim = 0;
  let m;
  while ((m = re.exec(text))) {
    if (m.index > ultim) resultats.push(text.slice(ultim, m.index));
    resultats.push(m[0]);
    ultim = m.index + m[0].length;
  }
  if (ultim < text.length) resultats.push(text.slice(ultim));
  return resultats;
};

const inlineMarkdown = (text) => {
  const frag = document.createDocumentFragment();
  for (const t of fragmentsInline(String(text))) {
    if (t.startsWith("**") && t.endsWith("**") && t.length > 4) {
      frag.append(crea("strong", {}, [t.slice(2, -2)]));
    } else if (t.startsWith("`") && t.endsWith("`") && t.length > 2) {
      frag.append(crea("code", {}, [t.slice(1, -1)]));
    } else if (t.startsWith("*") && t.endsWith("*") && t.length > 2) {
      frag.append(crea("em", {}, [t.slice(1, -1)]));
    } else if (t.startsWith("[")) {
      const idx = t.indexOf("](");
      const href = idx > 0 && t.endsWith(")") ? hrefSegur(t.slice(idx + 2, -1)) : null;
      if (idx > 0 && href != null) {
        frag.append(crea("a", { href, target: "_blank", rel: "noopener" }, [t.slice(1, idx)]));
      } else {
        frag.append(t);
      }
    } else {
      frag.append(t);
    }
  }
  return frag;
};

const renderMarkdown = (text) => {
  const article = crea("article", { class: "md-view" });
  const línies = String(text).replace(/\r\n?/g, "\n").split("\n");

  let llistaOberta = null; // { tag: 'ul'|'ol', el }
  let citaOberta = null; // element blockquote
  let codiObert = null; // element code (dins de pre)

  const tancaLlista = () => {
    if (llistaOberta) {
      llistaOberta = null;
    }
  };

  for (const raw of línies) {
    const l = raw.trimEnd();

    if (codiObert) {
      if (/^```/.test(l.trim())) {
        codiObert = null;
        continue;
      }
      codiObert.append(`${l}\n`);
      continue;
    }

    const oberturaCodi = l.trim().match(/^```/);
    if (oberturaCodi) {
      tancaLlista();
      citaOberta = null;
      const pre = crea("pre", {}, []);
      codiObert = crea("code", {});
      pre.append(codiObert);
      article.append(pre);
      continue;
    }

    const titol = l.match(/^(#{1,6})\s+(.*)$/);
    if (titol) {
      tancaLlista();
      citaOberta = null;
      article.append(crea(`h${titol[1].length}`, {}, [inlineMarkdown(titol[2])]));
      continue;
    }

    if (/^\s*([-*_])\1{2,}\s*$/.test(l)) {
      tancaLlista();
      citaOberta = null;
      article.append(crea("hr"));
      continue;
    }

    const ul = l.match(/^\s*[-*+]\s+(.*)$/);
    const ol = l.match(/^\s*\d+\.\s+(.*)$/);
    if (ul || ol) {
      citaOberta = null;
      const tag = ul ? "ul" : "ol";
      if (!llistaOberta || llistaOberta.tag !== tag) {
        tancaLlista();
        llistaOberta = { tag, el: crea(tag) };
        article.append(llistaOberta.el);
      }
      llistaOberta.el.append(crea("li", {}, [inlineMarkdown(ul ? ul[1] : ol[1])]));
      continue;
    }

    const cita = l.match(/^\s*>\s?(.*)$/);
    if (cita) {
      tancaLlista();
      if (!citaOberta) {
        citaOberta = crea("blockquote");
        article.append(citaOberta);
      }
      citaOberta.append(crea("p", {}, [inlineMarkdown(cita[1])]));
      continue;
    }

    if (l.trim() === "") {
      tancaLlista();
      citaOberta = null;
      continue;
    }

    tancaLlista();
    citaOberta = null;
    article.append(crea("p", {}, [inlineMarkdown(l)]));
  }
  return article;
};

/* Obre el visor amb el contingut corresponent al tipus de fitxer */
const renderVisor = async (f, m, token) => {
  const visor = $("#visor");
  visor.textContent = "";
  visor.append(crea("p", { class: "visor-loading", text: "Carregant…" }));

  const info = infoFormat(f.ext);
  const url = `${m.base ? `${m.base}/` : ""}${encamina(f.rel)}`;
  const cat = info.cat;

  if (!m.ok) {
    visor.textContent = "";
    visor.append(contingutNoDisponible(f));
    return;
  }

  if (cat === "pdf" || cat === "html") {
    visor.textContent = "";
    const marc = crea("iframe", { class: "visor-frame", title: f.nom });
    marc.src = url;
    visor.append(marc);
    return;
  }

  if (cat === "image") {
    visor.textContent = "";
    const img = crea("img", { class: "visor-img", alt: f.nom });
    img.src = url;
    img.addEventListener(
      "error",
      () => {
        if (token === peticio) {
          visor.textContent = "";
          visor.append(contingutNoDisponible(f));
        }
      },
      { once: true }
    );
    visor.append(img);
    return;
  }

  if (cat === "audio") {
    visor.textContent = "";
    const audio = crea("audio", { controls: "", preload: "metadata", class: "" });
    audio.src = url;
    visor.append(
      crea("div", { class: "audio-wrap" }, [
        audio,
        crea("p", { class: "audio-note", text: `Àudio ${info.label} · ${formatBytes(f.mida)}` }),
      ])
    );
    return;
  }

  if (cat === "office" || cat === "fitxer") {
    visor.textContent = "";
    visor.append(contingutOffice(info));
    return;
  }

  /* text, codi i markdown */
  if ((f.mida || 0) >= TEXT_PREVIEW_MAX) {
    visor.textContent = "";
    const marc = crea("iframe", { class: "visor-frame", title: f.nom });
    marc.src = url;
    visor.append(marc);
    return;
  }

  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const text = await r.text();
    if (token !== peticio) return;
    visor.textContent = "";
    if (f.ext === "md") {
      visor.append(renderMarkdown(text));
    } else {
      const pre = crea("pre", { class: "code-view" }, []);
      const code = crea("code", {});
      code.textContent = text;
      pre.append(code);
      visor.append(pre);
    }
  } catch (_) {
    if (token !== peticio) return;
    visor.textContent = "";
    const marc = crea("iframe", { class: "visor-frame", title: f.nom });
    marc.src = url;
    visor.append(marc);
  }
};

const modalOberta = () => !$("#modal").classList.contains("hidden");

const hrefFitxer = (m, f) => `${m.base ? `${m.base}/` : ""}${encamina(f.rel)}`;

const obreModal = async (i) => {
  const f = llistaActual[i];
  if (!f) return;

  idxActual = i;
  peticio += 1;
  const token = peticio;

  const info = infoFormat(f.ext);
  const m = modulDe(f.curs, f.modulId);
  const ruta = `${CURSA[f.curs].nom} · ${m.codi ? `${m.codi} · ` : ""}${f.modul}`;

  $("#modalKicker").textContent = `${info.label} · ${formatBytes(f.mida)}`;
  $("#modalTitle").textContent = f.nom;
  $("#modalTitle").title = f.rel;
  $("#modalSub").textContent = ruta;
  $("#modalPath").textContent = f.rel;
  $("#modalPath").title = f.rel;

  const open = $("#modalOpen");
  const download = $("#modalDownload");
  open.href = "#";
  download.href = "#";
  download.download = f.nom;

  $("#modal").classList.remove("hidden");
  document.body.classList.add("modal-open");

  const visor = $("#visor");
  visor.textContent = "";
  visor.append(crea("p", { class: "visor-loading", text: "Carregant…" }));

  try {
    const mInfo = await materialsInfo;
    if (token !== peticio) return;
    open.href = hrefFitxer(mInfo, f);
    download.href = hrefFitxer(mInfo, f);
    await renderVisor(f, mInfo, token);
  } catch (_) {
    if (token !== peticio) return;
    visor.textContent = "";
    visor.append(contingutNoDisponible(f));
  }

  actualitzaNav();
  $("#modalClose").focus();
};

const tancaModal = () => {
  if (!modalOberta()) return;
  peticio += 1;
  $("#modal").classList.add("hidden");
  document.body.classList.remove("modal-open");
  $("#visor").textContent = "";
};

const actualitzaNav = () => {
  const prev = $("#modalPrev");
  const next = $("#modalNext");
  prev.disabled = idxActual <= 0;
  next.disabled = idxActual >= llistaActual.length - 1;
  $("#modalPos").textContent =
    llistaActual.length > 1 ? `${idxActual + 1} / ${llistaActual.length}` : "";
};

/* ------------------------------------------------------------
   Cercador
   ------------------------------------------------------------ */
const inputCerca = () => $("#searchInput");

const actualitzaCerca = () => {
  $("#searchClear").classList.toggle("hidden", inputCerca().value === "");
};

let debounce;

/* ------------------------------------------------------------
   Arrencada
   ------------------------------------------------------------ */
const inici = () => {
  const arbre = $("#tree");

  construirArbre(arbre);
  renderResum();
  renderVista();

  /* navegació */
  arbre.addEventListener("click", (e) => clicArbre(arbre, e));

  /* chips */
  $("#chips").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-ext]");
    if (!btn) return;
    const ext = btn.dataset.ext;
    if (estat.formats.has(ext)) estat.formats.delete(ext);
    else estat.formats.add(ext);
    actualitzaArbre(arbre);
    renderVista();
  });

  /* graella -> visor */
  $("#grid").addEventListener("click", (e) => {
    const btn = e.target.closest(".card");
    if (!btn) return;
    obreModal(Number(btn.dataset.i));
  });

  /* cercador */
  const input = inputCerca();
  input.addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      estat.q = input.value;
      renderVista();
    }, DEBOUNCE_MS);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === KEYS.ESCAPE) {
      if (input.value !== "") {
        input.value = "";
        estat.q = "";
        renderVista();
      } else {
        input.blur();
      }
    }
  });

  $("#searchClear").addEventListener("click", () => {
    input.value = "";
    estat.q = "";
    renderVista();
    input.focus();
  });

  $("#emptyReset").addEventListener("click", () => {
    resetNavegacio();
    input.value = "";
    estat.q = "";
    actualitzaArbre(arbre);
    renderVista();
  });

  /* visor: botons i teclat */
  $("#modalClose").addEventListener("click", tancaModal);
  $("#modal").querySelector("[data-tanca]").addEventListener("click", tancaModal);
  $("#modalPrev").addEventListener("click", () => {
    if (idxActual > 0) obreModal(idxActual - 1);
  });
  $("#modalNext").addEventListener("click", () => {
    if (idxActual < llistaActual.length - 1) obreModal(idxActual + 1);
  });

  document.addEventListener("keydown", (e) => {
    if (modalOberta()) {
      if (e.key === KEYS.ESCAPE) {
        tancaModal();
      } else if (e.key === KEYS.FLETXA_ESQUERRA && idxActual > 0) {
        obreModal(idxActual - 1);
      } else if (e.key === KEYS.FLETXA_DRETA && idxActual < llistaActual.length - 1) {
        obreModal(idxActual + 1);
      }
      return;
    }
    if (e.key === KEYS.BARRA) {
      const actiu = document.activeElement;
      if (actiu && (/^(INPUT|TEXTAREA|SELECT)$/.test(actiu.tagName) || actiu.isContentEditable)) return;
      e.preventDefault();
      input.focus();
      input.select();
    }
  });

  actualitzaCerca();
};

if (typeof document !== "undefined" && typeof document.createElement === "function") {
  inici();
}
