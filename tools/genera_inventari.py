#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Genera data/fitxers.js amb l'inventari de fitxers dels materials DAW.

Ús:
    python3 tools/genera_inventari.py --materials /ruta/a/materials
    python3 tools/genera_inventari.py --materials /ruta/a/materials --out data/fitxers.js

La carpeta de materials ha de contenir moduls_1er_curs_24_25/ i moduls_2n_curs_25_26/.
Els fitxers no es copien: només se'n genera el catàleg amb metadades.
"""

import argparse
import json
import re
from pathlib import Path

# Carpeta arrel de cada curs dins de la carpeta de materials
CURSOS = [
    (1, "moduls_1er_curs_24_25"),
    (2, "moduls_2n_curs_25_26"),
]

# Etiquetes dels mòduls en català (clau: nom de la carpeta del mòdul)
MODULS = {
    # 1r curs (2024-25)
    "0000_tutoria": "Tutoria",
    "0179_angles_professional": "Anglès professional",
    "0373_llenguatges_marques_sistemes_gestion_informacio": (
        "Llenguatges de marques i sistemes de gestió d'informació"
    ),
    "0483_sistemes_informatics": "Sistemes informàtics",
    "0484_bases_dades": "Bases de dades",
    "0485_programacio_0487_entorns_desenvolupament": (
        "Programació i entorns de desenvolupament"
    ),
    "0615_disseny_interficies_web": "Disseny d'interfícies web",
    "1709_itinerari_personal_ocupabilitat_1": (
        "Itinerari personal per a l'ocupabilitat I"
    ),
    "info_util": "Informació útil",
    "investigacio": "Investigació",
    # 2n curs (2025-26)
    "0614_desplegament_d_aplicacions_web": "Desplegament d'aplicacions web",
    "0616_projecte_intermodular_de_desenvolupament_d_aplicacions_web": (
        "Projecte intermodular de desenvolupament d'aplicacions web"
    ),
    "1665_digitalitzacio_aplicada_als_sectors_productius": (
        "Digitalització aplicada als sectors productius"
    ),
    "1710_itinerari_personal_per_a_l_ocupabilitat_2": (
        "Itinerari personal per a l'ocupabilitat II"
    ),
    "client_servidor_sostenibilidad": "Client / servidor i sostenibilitat",
    "modul_professional_optatiu_machine_learning": "Optatiu: Machine Learning",
}

RE_CODI = re.compile(r"^(\d{4})_")


def codi_modul(carpeta):
    """Extreu el codi oficial del mòdul si la carpeta el duu al davant."""
    m = RE_CODI.match(carpeta)
    return m.group(1) if m else ""


def etiqueta_modul(modul_id):
    """Nom llegible del mòdul; si no està catalogat, humanitza la carpeta."""
    return MODULS.get(modul_id, modul_id.replace("_", " ").strip().title())


def fitxers_materials(materials: Path):
    """Recorre els materials i retorna la llista de fitxers amb metadades."""
    fitxers = []
    for curs, dirname in CURSOS:
        root = materials / dirname
        if not root.is_dir():
            continue
        for mod_dir in sorted(p for p in root.iterdir() if p.is_dir()):
            modul_id = mod_dir.name
            for f in sorted(mod_dir.rglob("*")):
                if not f.is_file():
                    continue
                ext = (f.suffix or "").lstrip(".").lower()
                fitxers.append(
                    {
                        "nom": f.name,
                        "ext": ext,
                        "mida": f.stat().st_size,
                        "curs": curs,
                        "modul": etiqueta_modul(modul_id),
                        "modulId": modul_id,
                        "codi": codi_modul(modul_id),
                        "rel": f.relative_to(materials).as_posix(),
                    }
                )
    return fitxers


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--materials",
        default="/home/jeironpro/Descargas/desenvolupament_aplicacions_web",
        help="carpeta arrel dels materials (conté moduls_1er_... i moduls_2n_...)",
    )
    parser.add_argument("--out", default="data/fitxers.js", help="fitxer de sortida")
    args = parser.parse_args()

    materials = Path(args.materials).expanduser().resolve()
    fitxers = fitxers_materials(materials)
    if not fitxers:
        raise SystemExit(
            f"No s'ha trobat cap fitxer a {materials}. Revisa la ruta --materials."
        )

    capcalera = "// Generat per tools/genera_inventari.py — no editar a mà.\n"
    cos = (
        capcalera
        + "window.FITXERS = "
        + json.dumps(fitxers, ensure_ascii=False, separators=(",", ":"))
        + ";\n"
    )

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(cos, encoding="utf-8")
    print(f"OK: {len(fitxers)} fitxers -> {out}")


if __name__ == "__main__":
    main()
