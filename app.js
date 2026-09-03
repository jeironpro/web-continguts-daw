/* ============================================================
   Continguts DAW — lògica de l'aplicació
   ============================================================ */
(() => {
  "use strict";

  const FITXERS = window.FITXERS || [];

  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

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

  const infoFormat = (ext) => {
    const conegut = FORMATS[ext];
    if (conegut) return conegut;
    let h = 0;
    for (const ch of ext) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return { label: ext.toUpperCase(), color: PALETA[h % PALETA.length], cat: "fitxer" };
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

  const escapa = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ------------------------------------------------------------
     Estat de navegació i filtratge
     ------------------------------------------------------------ */
  const estat = {
    curs: null, // 1 | 2 | null
    modul: null, // modulId | null
    formats: new Set(), // extensions seleccionades
  };

  const resetNavegacio = () => {
    estat.curs = null;
    estat.modul = null;
    estat.formats.clear();
  };

  const clauModul = (curs, modulId) => `${curs}|${modulId}`;

  /* ------------------------------------------------------------
     Índexs sobre l'inventari
     ------------------------------------------------------------ */
  const modulsPerCurs = { 1: [], 2: [] };
  const vistos = new Set();
  for (const f of FITXERS) {
    const clau = clauModul(f.curs, f.modulId);
    if (!vistos.has(clau)) {
      vistos.add(clau);
      modulsPerCurs[f.curs].push({ curs: f.curs, id: f.modulId, codi: f.codi, label: f.modul, n: 0, formats: {} });
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
      m.exts = Object.keys(m.formats).sort(
        (a, b) => m.formats[b] - m.formats[a] || a.localeCompare(b)
      );
    }
  }

  const modulDe = (curs, id) => perModul.get(clauModul(curs, id));

  /* ------------------------------------------------------------
     Filtratge
     ------------------------------------------------------------ */
  const filtra = () =>
    FITXERS.filter((f) => {
      if (estat.curs !== null && f.curs !== estat.curs) return false;
      if (estat.modul !== null && f.modulId !== estat.modul) return false;
      if (estat.formats.size > 0 && !estat.formats.has(f.ext)) return false;
      return true;
    });

  /* ------------------------------------------------------------
     Render del resum d'estadístiques (una sola vegada)
     ------------------------------------------------------------ */
  const renderResum = () => {
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

    $("#summary").innerHTML = dades
      .map(
        (d) => `
          <article class="stat">
            <span class="stat-num">${d.num}</span>
            <span class="stat-label">${d.label}</span>
          </article>`
      )
      .join("");
  };

  /* ------------------------------------------------------------
     Arbre de navegació (sidebar)
     ------------------------------------------------------------ */
  const htmlArbre = () => {
    let html = `
      <button type="button" class="tree-btn root-btn" data-act="root" data-root>
        <svg class="tree-ico" viewBox="0 0 16 16" aria-hidden="true">
          <rect x="1" y="1" width="6" height="6" fill="none" stroke="currentColor" stroke-width="2"/>
          <rect x="9" y="1" width="6" height="6" fill="none" stroke="currentColor" stroke-width="2"/>
          <rect x="1" y="9" width="6" height="6" fill="none" stroke="currentColor" stroke-width="2"/>
          <rect x="9" y="9" width="6" height="6" fill="none" stroke="currentColor" stroke-width="2"/>
        </svg>
        <span class="tree-lbl">Tots els fitxers</span>
        <span class="tree-count">${FITXERS.length}</span>
      </button>
      <div class="tree-sep" role="presentation"></div>`;

    for (const curs of [1, 2]) {
      const moduls = modulsPerCurs[curs];
      html += `
      <section class="curs" data-curs="${curs}">
        <button type="button" class="tree-btn curs-btn" data-act="curs" data-curs="${curs}" aria-expanded="false">
          <svg class="caret" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.5 8.5 6 3 10.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span class="tree-lbl">${CURSA[curs].nom}</span>
          <span class="tree-count">${moduls.reduce((acc, m) => acc + m.n, 0)}</span>
        </button>
        <div class="curs-body">`;

      for (const m of moduls) {
        const codiHtml = m.codi ? `<span class="tree-codi">${m.codi}</span>` : "";
        html += `
          <button type="button" class="tree-btn modul-btn" data-act="modul" data-curs="${curs}" data-modul="${escapa(m.id)}">
            ${codiHtml}
            <span class="tree-lbl">${escapa(m.label)}</span>
            <span class="tree-count">${m.n}</span>
          </button>
          <div class="fmt-list">`;
        for (const ext of m.exts) {
          const info = infoFormat(ext);
          html += `
            <button type="button" class="tree-btn fmt-btn" data-act="format" data-curs="${curs}" data-modul="${escapa(m.id)}" data-ext="${escapa(ext)}">
              <span class="dot" style="--c:${info.color}" aria-hidden="true"></span>
              <span class="tree-lbl">${escapa(info.label)}</span>
              <span class="tree-count">${m.formats[ext]}</span>
            </button>`;
        }
        html += `</div>`;
      }
      html += `</div></section>`;
    }
    return html;
  };

  const arbre = $("#tree");
  arbre.innerHTML = htmlArbre();

  const obraCurs = (curs, obert) => {
    const seccio = arbre.querySelector(`.curs[data-curs="${curs}"]`);
    seccio.classList.toggle("open", obert);
    const btn = seccio.querySelector(".curs-btn");
    btn.setAttribute("aria-expanded", obert ? "true" : "false");
  };

  const actualitzaArbre = () => {
    $$("[data-act]", arbre).forEach((b) => {
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
    });
    for (const curs of [1, 2]) {
      obraCurs(curs, estat.curs === curs);
    }
  };

  arbre.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-act]");
    if (!btn || !arbre.contains(btn)) return;
    const act = btn.dataset.act;
    const curs = Number(btn.dataset.curs);

    if (act === "root") {
      resetNavegacio();
    } else if (act === "curs") {
      const seccio = btn.closest(".curs");
      if (estat.curs === curs && estat.modul === null && seccio.classList.contains("open")) {
        obraCurs(curs, false); // replega sense canviar la selecció
        actualitzaArbre();
        return;
      }
      estat.curs = curs;
      estat.modul = null;
      estat.formats.clear();
      obraCurs(curs, true);
    } else if (act === "modul") {
      estat.curs = curs;
      estat.modul = btn.dataset.modul;
      estat.formats.clear();
      obraCurs(curs, true);
      btn.scrollIntoView({ block: "nearest" });
    } else if (act === "format") {
      estat.curs = curs;
      estat.modul = btn.dataset.modul;
      estat.formats = new Set([btn.dataset.ext]);
      obraCurs(curs, true);
      btn.scrollIntoView({ block: "nearest" });
    }
    actualitzaArbre();
    renderVista();
  });

  /* ------------------------------------------------------------
     Render de la capçalera de vista i la graella
     ------------------------------------------------------------ */
  const renderMeta = (llista) => {
    const títol = $("#viewTitle");
    const sub = $("#viewSub");
    const count = $("#viewCount");

    const formatTitols = () =>
      [...estat.formats]
        .map((ext) => infoFormat(ext).label)
        .sort()
        .join(" + ");

    let titolText = "Tots els fitxers";
    let subParts = [];
    if (estat.formats.size > 0 && estat.modul) {
      titolText = formatTitols();
      subParts.push(modulDe(estat.curs, estat.modul).label);
    } else if (estat.modul) {
      titolText = modulDe(estat.curs, estat.modul).label;
    } else if (estat.curs) {
      titolText = CURSA[estat.curs].nom;
    }
    if (estat.curs === null) {
      sub.textContent = "Visor dels materials del CFGS Desenvolupament d'Aplicacions Web";
    } else if (estat.modul === null) {
      const extsCurs = new Set();
      for (const m of modulsPerCurs[estat.curs]) {
        for (const ext of Object.keys(m.formats)) extsCurs.add(ext);
      }
      sub.textContent = `${modulsPerCurs[estat.curs].length} mòduls · ${extsCurs.size} formats`;
    } else if (estat.formats.size === 0) {
      const m = modulDe(estat.curs, estat.modul);
      sub.textContent = `${CURSA[estat.curs].nom} · ${m.exts.length} formats`;
    } else {
      sub.textContent = subParts.join(" · ");
    }
    títol.textContent = titolText;
    count.textContent = `${llista.length.toLocaleString("ca-ES")} fitxers`;
  };

  const renderGraella = (llista) => {
    const grid = $("#grid");
    grid.innerHTML = llista
      .map((f, i) => {
        const info = infoFormat(f.ext);
        const colorText = INK_ON.has(info.color) ? "var(--ink)" : "#ffffff";
        return `
          <button type="button" class="card" data-i="${i}"
            title="${escapa(f.nom)} · ${escapa(f.modul)}"
            aria-label="Veure ${escapa(f.nom)} (${escapa(info.label)})">
            <span class="card-visual" style="--c:${info.color}">
              <span class="card-ext" style="color:${colorText}">${escapa(info.label)}</span>
              <span class="card-size" style="color:${colorText}">${formatBytes(f.mida)}</span>
            </span>
            <span class="card-foot">
              <span class="card-modul">${escapa(f.modul)}</span>
              <span class="card-nom">${escapa(f.nom)}</span>
            </span>
          </button>`;
      })
      .join("");
  };

  const renderBuit = (llista) => {
    const buit = $("#empty");
    if (llista.length === 0) {
      buit.classList.remove("hidden");
      $("#emptyMsg").textContent =
        FITXERS.length === 0
          ? "No s'ha pogut carregar l'inventari (data/fitxers.js)."
          : "No s'han trobat fitxers amb aquests filtres.";
    } else {
      buit.classList.add("hidden");
    }
  };

  const renderVista = () => {
    const llista = filtra();
    renderMeta(llista);
    renderGraella(llista);
    renderBuit(llista);
  };

  /* ------------------------------------------------------------
     Arrencada
     ------------------------------------------------------------ */
  const inicialitza = () => {
    renderResum();
    renderVista();
    $("#emptyReset").addEventListener("click", () => {
      resetNavegacio();
      actualitzaArbre();
      renderVista();
    });
  };

  document.addEventListener("DOMContentLoaded", inicialitza);
})();
