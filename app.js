/* ============================================================
   Continguts DAW — lògica de l'aplicació
   ============================================================ */
(() => {
  "use strict";

  const FITXERS = window.FITXERS || [];

  const $ = (sel) => document.querySelector(sel);

  const CURSA = {
    1: { nom: "1r curs", carpeta: "moduls_1er_curs_24_25" },
    2: { nom: "2n curs", carpeta: "moduls_2n_curs_25_26" },
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

  const inicialitza = () => {
    const numCursos = new Set(FITXERS.map((f) => f.curs)).size;
    const numModuls = new Set(FITXERS.map((f) => `${f.curs}:${f.modulId}`)).size;
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

    $("#viewSub").textContent =
      FITXERS.length > 0
        ? `${FITXERS.length.toLocaleString("ca-ES")} fitxers · ${formatBytes(midaTotal)} en total`
        : "Inventari buit";

    if (FITXERS.length === 0) {
      $("#empty").classList.remove("hidden");
      $("#empty").textContent = "No s'ha pogut carregar l'inventari (data/fitxers.js).";
    }
  };

  document.addEventListener("DOMContentLoaded", inicialitza);
})();
