--
-- load_data.sql
-- Wczytuje dane z plików CSV do wcześniej utworzonych tabel.
-- Pliki zostały skopiowane do katalogu /datasets/
--

-- Województwa
COPY wojewodztwa
FROM '/datasets/wojewodztwa.csv'
DELIMITER ','
CSV HEADER;

-- Powiaty
COPY powiaty
FROM '/datasets/powiaty.csv'
DELIMITER ','
CSV HEADER;

-- Gminy
COPY gminy
FROM '/datasets/gminy.csv'
DELIMITER ','
CSV HEADER;

-- Miejscowości
COPY miejscowosci
FROM '/datasets/miejscowosci.csv'
DELIMITER ','
CSV HEADER;

-- Kategorie uczniów
COPY kategorie_uczniow
FROM '/datasets/kategorie_uczniow.csv'
DELIMITER ','
CSV HEADER;

-- Kody pocztowe
COPY kody_pocztowe
FROM '/datasets/kody_pocztowe.csv'
DELIMITER ','
CSV HEADER;

-- Specyfiki szkół
COPY specyfiki_szkol
FROM '/datasets/specyfiki_szkol.csv'
DELIMITER ','
CSV HEADER;

-- Rodzaje publiczności
COPY rodzaje_publicznosci
FROM '/datasets/rodzaje_publicznosci.csv'
DELIMITER ','
CSV HEADER;

-- Rodzaje placówek
COPY rodzaje_placowek
FROM '/datasets/rodzaje_placowek.csv'
DELIMITER ','
CSV HEADER;

-- Typy organów prowadzących
COPY typy_organow_prowadzacych
FROM '/datasets/typy_organow_prowadzacych.csv'
DELIMITER ','
CSV HEADER;

-- Typy podmiotów
COPY typy_podmiotow
FROM '/datasets/typy_podmiotow.csv'
DELIMITER ','
CSV HEADER;

-- Organy prowadzące (korzystamy z pliku *_czyste.csv)
COPY organy_prowadzace
FROM '/datasets/organy_prowadzace_czyste.csv'
DELIMITER ','
CSV HEADER;

-- Placówki oświatowe (korzystamy z pliku *_czyste.csv)
COPY placowki_oswiatowe
FROM '/datasets/placowki_oswiatowe_czyste.csv'
DELIMITER ','
CSV HEADER;

-- Tabela powiązań placówki <-> organy prowadzące
COPY placowki_organy_prowadzace
FROM '/datasets/placowki_organy_prowadzace.csv'
DELIMITER ','
CSV HEADER;

-- Adresy
COPY adresy
FROM '/datasets/adresy.csv'
DELIMITER ','
CSV HEADER;

-- Dane kontaktowe
COPY dane_kontaktowe
FROM '/datasets/dane_kontaktowe.csv'
DELIMITER ','
CSV HEADER;

-- Koniec wczytywania
