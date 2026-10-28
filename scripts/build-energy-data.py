#!/usr/bin/env python3
"""Gera energy-data.js com tarifas (ANEEL), bandeiras (ANEEL) e irradiação solar (NASA POWER).

Uso:
    python3 scripts/build-energy-data.py            # baixa tudo (o CSV de tarifas tem ~180 MB)
    python3 scripts/build-energy-data.py --cache /pasta/com/csvs

Rode a partir da raiz do projeto. Depois troque o ?v= dos scripts no index.html.
"""
import argparse
import csv
import datetime
import json
import os
import urllib.request

TARIFFS_URL = "https://dadosabertos.aneel.gov.br/dataset/5a583f3e-1646-4f67-bf0f-69db4203e89e/resource/fcf2906c-7c32-4b9b-a637-054e7a5234f4/download/tarifas-homologadas-distribuidoras-energia-eletrica.csv"
FLAGS_URL = "https://dadosabertos.aneel.gov.br/dataset/7f43a020-6dc5-44b8-80b4-d97eaa94436c/resource/0591b8f6-fe54-437b-b72b-1aa2efd46e42/download/bandeira-tarifaria-acionamento.csv"
SOLAR_URL = "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=ALLSKY_SFC_SW_DWN&community=RE&longitude={lon}&latitude={lat}&format=JSON"

# Sigla do agente na ANEEL -> (nome exibido, UF). Distribuidoras fora desta lista são ignoradas.
NAMES = {
    "CERSAD DISTRIBUI": ("Cersad", "SC"), "COOPERZEM": ("Cooperzem", "SC"), "CERGRAL": ("Cergral", "SC"),
    "CERGAPA": ("Cergapa", "SC"), "CEGERO": ("Cegero", "SC"), "COORSEL": ("Coorsel", "SC"), "DMED": ("DME", "MG"),
    "COOPERLUZ": ("Cooperluz", "RS"), "CERILUZ": ("Ceriluz", "RS"), "CERBRANORTE": ("Cerbranorte", "SC"),
    "CODESAM": ("Codesam", "SC"), "ENEL CE": ("Enel CE", "CE"), "EPB": ("Energisa PB", "PB"), "CERSUL": ("Cersul", "SC"),
    "COPREL": ("Coprel", "RS"), "SULGIPE": ("Sulgipe", "SE"), "COOPERA": ("Coopera", "SC"), "COOPERMILA": ("Coopermila", "SC"),
    "HIDROPAN": ("Hidropan", "RS"), "CERTHIL": ("Certhil", "RS"), "CERAL-DIS": ("Ceral DIS", "PR"), "CEMIRIM": ("Cemirim", "SP"),
    "COCEL": ("Cocel", "PR"), "COOPERSUL": ("Coopersul", "RS"), "CPFL-PAULISTA": ("CPFL Paulista", "SP"), "CERPRO": ("Cerpro", "SP"),
    "CERRP": ("Cerrp", "SP"), "MUXENERGIA": ("Muxenergia", "RS"), "ESE": ("Energisa SE", "SE"), "COOPERALIANÇA": ("Cooperaliança", "SC"),
    "CELESC": ("Celesc", "SC"), "DCELT": ("Dcelt", "SC"), "EFLJC": ("EFLJC", "SC"), "EFLUL": ("EFLUL", "SC"), "Ceraçá": ("Ceraçá", "SC"),
    "ERO": ("Energisa RO", "RO"), "DEMEI": ("Demei", "RS"), "COPEL-DIS": ("Copel", "PR"), "PACTO ENERGIA PR": ("Pacto Energia", "PR"),
    "CASTRO-DIS": ("Castro DIS", "PR"), "CEJAMA": ("Cejama", "SC"), "COSERN": ("Neoenergia Cosern", "RN"), "CERTAJA": ("Certaja", "RS"),
    "CRELUZ-D": ("Creluz", "RS"), "ELETROPAULO": ("Enel SP", "SP"), "Âmbar Roraima": ("Âmbar Roraima", "RR"),
    "COOPERCOCAL": ("Coopercocal", "SC"), "ELETROCAR": ("Eletrocar", "RS"), "Neoenergia PE": ("Neoenergia Pernambuco", "PE"),
    "CPFL Santa Cruz": ("CPFL Santa Cruz", "SP"), "ESS": ("Energisa Sul-Sudeste", "SP"), "CHESP": ("Chesp", "GO"),
    "CERIPa": ("Ceripa", "SP"), "CEEE-D": ("CEEE Equatorial", "RS"), "CERNHE": ("Cernhe", "SP"), "ELFSM": ("ELFSM", "ES"),
    "CEA": ("CEA Equatorial", "AP"), "EAC": ("Energisa AC", "AC"), "Neoenergia Brasília": ("Neoenergia Brasília", "DF"),
    "UHENPAL": ("Uhenpal", "RS"), "CERFOX": ("Cerfox", "RS"), "EDP ES": ("EDP ES", "ES"), "EQUATORIAL AL": ("Equatorial AL", "AL"),
    "CEPRAG": ("Ceprag", "SC"), "CERGAL": ("Cergal", "SC"), "Âmbar Amazonas": ("Âmbar Amazonas", "AM"),
    "COELBA": ("Neoenergia Coelba", "BA"), "LIGHT SESA": ("Light", "RJ"), "CERIM": ("Cerim", "SP"),
    "EQUATORIAL MA": ("Equatorial MA", "MA"), "CERMISSÕES": ("Cermissões", "RS"), "ELEKTRO": ("Neoenergia Elektro", "SP"),
    "EMT": ("Energisa MT", "MT"), "CEMIG-D": ("Cemig", "MG"), "CETRIL": ("Cetril", "SP"), "CERTEL ENERGIA": ("Certel Energia", "RS"),
    "CERMOFUL": ("Cermoful", "SC"), "EMR": ("Energisa Minas Rio", "MG"), "CERVAM": ("Cervam", "SP"), "RGE": ("RGE", "RS"),
    "EQUATORIAL PI": ("Equatorial PI", "PI"), "CERMC": ("Cermc", "SP"), "CELETRO": ("Celetro", "RS"), "EMS": ("Energisa MS", "MS"),
    "ETO": ("Energisa TO", "TO"), "CEDRI": ("Cedri", "SP"), "CERAL ANITÁPOLIS": ("Ceral Anitápolis", "SC"), "CERCOS": ("Cercos", "SE"),
    "CERPALO": ("Cerpalo", "SC"), "EQUATORIAL PA": ("Equatorial PA", "PA"), "CEREJ": ("Cerej", "SC"), "ENEL RJ": ("Enel RJ", "RJ"),
    "CEDRAP": ("Cedrap", "SP"), "CERIS": ("Ceris", "SP"), "CERAL ARARUAMA": ("Ceral Araruama", "RJ"), "CERTREL": ("Certrel", "SC"),
    "COOPERNORTE": ("Coopernorte", "RS"), "CERCI": ("Cerci", "RJ"), "CERES": ("Ceres", "RJ"), "EQUATORIAL GO": ("Equatorial GO", "GO"),
    "CPFL-PIRATINING": ("CPFL Piratininga", "SP"), "EDP SP": ("EDP SP", "SP"),
}
# Distribuidoras que a ANEEL publica sem sigla ("Não Informado"), identificadas pelo CNPJ.
NAMES_BY_CNPJ = {"89435598000155": ("Creral", "RS")}

CAPITALS = {
    "AC": ("Rio Branco", -9.97, -67.81), "AL": ("Maceió", -9.67, -35.74), "AP": ("Macapá", 0.03, -51.07),
    "AM": ("Manaus", -3.12, -60.02), "BA": ("Salvador", -12.97, -38.50), "CE": ("Fortaleza", -3.73, -38.53),
    "DF": ("Brasília", -15.79, -47.88), "ES": ("Vitória", -20.32, -40.34), "GO": ("Goiânia", -16.68, -49.25),
    "MA": ("São Luís", -2.53, -44.30), "MT": ("Cuiabá", -15.60, -56.10), "MS": ("Campo Grande", -20.47, -54.62),
    "MG": ("Belo Horizonte", -19.92, -43.94), "PA": ("Belém", -1.46, -48.50), "PB": ("João Pessoa", -7.12, -34.86),
    "PR": ("Curitiba", -25.43, -49.27), "PE": ("Recife", -8.05, -34.88), "PI": ("Teresina", -5.09, -42.80),
    "RJ": ("Rio de Janeiro", -22.91, -43.17), "RN": ("Natal", -5.79, -35.21), "RS": ("Porto Alegre", -30.03, -51.23),
    "RO": ("Porto Velho", -8.76, -63.90), "RR": ("Boa Vista", 2.82, -60.67), "SC": ("Florianópolis", -27.60, -48.55),
    "SP": ("São Paulo", -23.55, -46.63), "SE": ("Aracaju", -10.91, -37.07), "TO": ("Palmas", -10.18, -48.33),
}

FLAG_IDS = {"Verde": "verde", "Amarela": "amarela", "Vermelha P1": "vermelha1", "Vermelha P2": "vermelha2"}


def number(value):
    return float(value.replace(",", ".")) if value.strip(",") else 0.0


def source(cache, name, url):
    path = os.path.join(cache, name)
    if not os.path.exists(path):
        print(f"Baixando {name}...")
        urllib.request.urlretrieve(url, path)
    return path


def build_tariffs(path):
    # Tarifa residencial B1 convencional. Na base da ANEEL, B1, B2 e B3 têm a mesma TE + TUSD; descontos são aplicados à parte.
    latest = {}
    with open(path, encoding="utf-8") as file:
        for row in csv.DictReader(file, delimiter=";"):
            agent = row["SigAgente"] if row["SigAgente"] in NAMES else row["NumCNPJDistribuidora"]
            if agent not in NAMES and agent not in NAMES_BY_CNPJ:
                continue
            if row["DscBaseTarifaria"] != "Tarifa de Aplicação" or row["DscModalidadeTarifaria"] != "Convencional":
                continue
            if (row["DscSubGrupo"], row["DscClasse"], row["DscSubClasse"], row["DscDetalhe"]) != ("B1", "Residencial", "Residencial", "Não se aplica"):
                continue
            if row["SigAgenteAcessante"] != "Não se aplica" or row["DscUnidadeTerciaria"] != "MWh":
                continue
            current = latest.get(agent)
            if current is None or row["DatInicioVigencia"] > current["validFrom"]:
                name, uf = NAMES.get(agent) or NAMES_BY_CNPJ[agent]
                latest[agent] = {"name": name, "uf": uf, "validFrom": row["DatInicioVigencia"], "tusd": round(number(row["VlrTUSD"]) / 1000, 5), "te": round(number(row["VlrTE"]) / 1000, 5)}
    missing = sorted((set(NAMES) | set(NAMES_BY_CNPJ)) - set(latest))
    if missing:
        raise SystemExit(f"Sem tarifa residencial para: {missing}")
    return sorted(latest.values(), key=lambda item: (item["uf"], item["name"]))


def build_flags(path):
    with open(path, encoding="utf-8") as file:
        rows = sorted(csv.DictReader(file, delimiter=";"), key=lambda row: row["DatCompetencia"])
    history = [{"month": row["DatCompetencia"][:7], "flag": FLAG_IDS[row["NomBandeiraAcionada"]], "extra": round(number(row["VlrAdicionalBandeira"]) / 1000, 5)} for row in rows if row["NomBandeiraAcionada"] in FLAG_IDS]
    return history[-24:]


def build_solar():
    solar = {}
    for uf, (city, lat, lon) in CAPITALS.items():
        with urllib.request.urlopen(SOLAR_URL.format(lat=lat, lon=lon), timeout=60) as response:
            data = json.load(response)
        solar[uf] = {"city": city, "hsp": round(data["properties"]["parameter"]["ALLSKY_SFC_SW_DWN"]["ANN"], 2)}
    return solar


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--cache", default=".energy-cache", help="pasta para guardar os CSVs baixados")
    args = parser.parse_args()
    os.makedirs(args.cache, exist_ok=True)
    data = {
        "updatedAt": datetime.date.today().strftime("%d/%m/%Y"),
        "distributors": build_tariffs(source(args.cache, "tarifas.csv", TARIFFS_URL)),
        "flagHistory": build_flags(source(args.cache, "acionamento.csv", FLAGS_URL)),
        "solar": build_solar(),
    }
    with open("energy-data.js", "w", encoding="utf-8") as file:
        file.write("/* Gerado por scripts/build-energy-data.py. Fontes: ANEEL (dados abertos) e NASA POWER. Não edite à mão. */\n")
        file.write("window.ALLE_ENERGY_DATA = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n")
    print(f"energy-data.js: {len(data['distributors'])} distribuidoras, {len(data['flagHistory'])} meses de bandeira.")


if __name__ == "__main__":
    main()
