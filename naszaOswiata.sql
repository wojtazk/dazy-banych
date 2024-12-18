-- Tabele podstawowe
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    nazwa VARCHAR(20) UNIQUE NOT NULL
);

INSERT INTO role (nazwa) VALUES ('administrator'), ('administrator_szkoly'), ('zwykly_uzytkownik'), ('moderator'), ('zbanowany'), ('usuniety');

-- ok
CREATE TABLE gminy (
    id VARCHAR(7) PRIMARY KEY,
    nazwa VARCHAR(50) NOT NULL
);

-- ok
CREATE TABLE wojewodztwa (
    id VARCHAR(2) PRIMARY KEY,
    nazwa VARCHAR(50) UNIQUE NOT NULL
);

-- ok
CREATE TABLE powiaty (
    id VARCHAR(4) PRIMARY KEY,
    nazwa VARCHAR(50) NOT NULL
);

-- ok
CREATE TABLE miejscowosci (
    id SERIAL PRIMARY KEY,
    nazwa VARCHAR(50) UNIQUE NOT NULL
);

-- ok
CREATE TABLE typy_podmiotow (
    id SERIAL PRIMARY KEY,
    nazwa VARCHAR(100) UNIQUE NOT NULL
);

-- ok
CREATE TABLE rodzaje_placowek (
    id SERIAL PRIMARY KEY,
    nazwa VARCHAR(100) UNIQUE NOT NULL
);

-- ok
CREATE TABLE kategorie_uczniow (
    id SERIAL PRIMARY KEY,
    nazwa VARCHAR(50) UNIQUE NOT NULL
);

-- ok
CREATE TABLE rodzaje_publicznosci (
    id SERIAL PRIMARY KEY,
    nazwa VARCHAR(100) UNIQUE NOT NULL
);

-- ok
CREATE TABLE specyfiki_szkol (
    id SERIAL PRIMARY KEY,
    nazwa VARCHAR(50) UNIQUE NOT NULL
);

-- ok
CREATE TABLE typy_organow_prowadzacych (
    id SERIAL PRIMARY KEY,
    nazwa VARCHAR(100) UNIQUE NOT NULL
);

-- ok
CREATE TABLE organy_prowadzace (
    id SERIAL PRIMARY KEY,
    nazwa VARCHAR(200) NOT NULL
);

-- ok
CREATE TABLE kody_pocztowe (
    id SERIAL PRIMARY KEY,
    kod VARCHAR(10) UNIQUE NOT NULL,

    -- kod powinine miec format XX-XXX
    CONSTRAINT kody_pocztowe_kod_constraint CHECK (
        kod ~ '^[0-9]{2}-[0-9]{3}$'
    )
);

-- Tabela placówek oświatowych
-- placowki_oswiatowe_czyste -> ok (kto wpisywal te dane ja pier.....)
CREATE TABLE placowki_oswiatowe (
    rspo VARCHAR(10) PRIMARY KEY,
    regon VARCHAR(14) UNIQUE NOT NULL,
    nazwa_placowki TEXT NOT NULL,
    id_typ_podmiotu INTEGER NOT NULL,
    id_podmiot_glowny VARCHAR(10),
    id_podmiot_nadrzedny VARCHAR(10),
    id_rodzaj_placowki INTEGER NOT NULL,
    id_kategoria_uczniow INTEGER NOT NULL,
    id_rodzaj_publicznosci INTEGER NOT NULL,
    id_specyfika_szkoly INTEGER NOT NULL,
    id_typ_organu_prowadzacego INTEGER NOT NULL,
    liczba_uczniow_ogolem INTEGER,
    liczba_uczennic INTEGER CHECK (liczba_uczennic <= liczba_uczniow_ogolem),
    FOREIGN KEY (id_typ_podmiotu) REFERENCES typy_podmiotow(id),
    FOREIGN KEY (id_rodzaj_placowki) REFERENCES rodzaje_placowek(id),
    FOREIGN KEY (id_kategoria_uczniow) REFERENCES kategorie_uczniow(id),
    FOREIGN KEY (id_rodzaj_publicznosci) REFERENCES rodzaje_publicznosci(id),
    FOREIGN KEY (id_specyfika_szkoly) REFERENCES specyfiki_szkol(id),
    FOREIGN KEY (id_typ_organu_prowadzacego) REFERENCES typy_organow_prowadzacych(id)
);

-- Tabela łącząca placówki z organami prowadzącymi
-- ok
CREATE TABLE placowki_organy_prowadzace (
    rspo VARCHAR(10) NOT NULL,
    id_organ_prowadzacy INTEGER NOT NULL,
    FOREIGN KEY (rspo) REFERENCES placowki_oswiatowe(rspo),
    FOREIGN KEY (id_organ_prowadzacy) REFERENCES organy_prowadzace(id)
);

-- Adresy placówek
-- ok
CREATE TABLE adresy (
    rspo VARCHAR(10) PRIMARY KEY,
    ulica VARCHAR(100),
    numer_domu VARCHAR(20) NOT NULL,
    numer_lokalu VARCHAR(15),
    id_kod_pocztowy INTEGER NOT NULL,
    id_miejscowosc INTEGER,
    id_wojewodztwo VARCHAR(2) NOT NULL,
    id_powiat VARCHAR(4) NOT NULL,
    id_gmina VARCHAR(7) NOT NULL,
    FOREIGN KEY (rspo) REFERENCES placowki_oswiatowe(rspo),
    FOREIGN KEY (id_kod_pocztowy) REFERENCES kody_pocztowe(id),
    FOREIGN KEY (id_miejscowosc) REFERENCES miejscowosci(id),
    FOREIGN KEY (id_wojewodztwo) REFERENCES wojewodztwa(id),
    FOREIGN KEY (id_powiat) REFERENCES powiaty(id),
    FOREIGN KEY (id_gmina) REFERENCES gminy(id)
);

-- Dane kontaktowe placówek
-- ok
CREATE TABLE dane_kontaktowe (
    rspo VARCHAR(10) PRIMARY KEY,
    nr_tel VARCHAR(15),
    email VARCHAR(255),
    strona_www VARCHAR(500),
    FOREIGN KEY (rspo) REFERENCES placowki_oswiatowe(rspo),

    -- ? -> 0 or 1, + - 1 or more
    CONSTRAINT dane_kontaktowe_nr_tel_constraint CHECK (
        nr_tel ~ '^[+]?[0-9 -]+$'
    ),

    -- sprawdzenie czy w emailu jest '@'
    CONSTRAINT dane_konstaktowe_email_constraint CHECK (
        email LIKE '%@%'
    )
);

-- Użytkownicy i powiązane tabele
CREATE TABLE uzytkownicy (
    id SERIAL PRIMARY KEY,
    nazwa_uzytkownika VARCHAR(50) NOT NULL UNIQUE,
    haslo_hash TEXT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    nr_tel VARCHAR(20) NOT NULL UNIQUE,
    id_rola INTEGER NOT NULL,
    data_utworzenia TIMESTAMPTZ DEFAULT now(),
    data_ostatniej_proby_logowania TIMESTAMPTZ,
    FOREIGN KEY (id_rola) REFERENCES role(id),

    CONSTRAINT uzytkownicy_nr_tel_constraint CHECK (
        nr_tel ~ '^[+]?[0-9 -]+$'
    ),

    CONSTRAINT uzytkownicy_email_constraint CHECK (
        email LIKE '%@%'
    ),

    -- sprawdzenie czy data ostatniego logowania jest poznij niz data utworzenia
    CONSTRAINT uzytkownicy_data_ostatniej_proby_logowania_constraint CHECK (
        data_ostatniej_proby_logowania >= data_utworzenia
        OR data_ostatniej_proby_logowania IS NULL
    )
);

CREATE TABLE admini_szkoly (
    uzytkownik_id INTEGER,
    rspo VARCHAR(10) NOT NULL,
    FOREIGN KEY (uzytkownik_id) REFERENCES uzytkownicy(id),
    FOREIGN KEY (rspo) REFERENCES placowki_oswiatowe(rspo)
);

CREATE TABLE opinie (
    id SERIAL PRIMARY KEY,
    tresc VARCHAR(200) NOT NULL,
    ocena INTEGER NOT NULL,
    uzytkownik_id INTEGER NOT NULL,
    rspo VARCHAR(10) NOT NULL,
    zweryfikowana BOOLEAN DEFAULT FALSE,
    widoczna BOOLEAN DEFAULT FALSE,
    data_utworzenia TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (uzytkownik_id) REFERENCES uzytkownicy(id),
    FOREIGN KEY (rspo) REFERENCES placowki_oswiatowe(rspo),

    -- ocena powinna miec wartosc od 1 do 10 w inkrementach po 0.5
    CONSTRAINT opinie_ocena_constraint CHECK (
        ocena >= 1
        AND ocena <= 10
        AND ocena * 2 = FLOOR(ocena * 2)
    )
);

CREATE TABLE zgloszone_opinie (
    id SERIAL PRIMARY KEY,
    id_opinii INTEGER NOT NULL,
    uzytkownik_id INTEGER NOT NULL,
    data_zgloszenia TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (id_opinii) REFERENCES opinie(id),
    FOREIGN KEY (uzytkownik_id) REFERENCES uzytkownicy(id)
);

CREATE TABLE ogloszenia_uzytkownikow (
    id SERIAL PRIMARY KEY,
    tytul VARCHAR(30),
    tresc VARCHAR(1000),
    uzytkownik_id INTEGER NOT NULL,
    rspo VARCHAR(10) NOT NULL,
    zatwierdzone BOOLEAN DEFAULT FALSE,
    widoczne BOOLEAN DEFAULT TRUE,
    data_utworzenia TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (uzytkownik_id) REFERENCES uzytkownicy(id),
    FOREIGN KEY (rspo) REFERENCES placowki_oswiatowe(rspo)
);

CREATE TABLE ogloszenia_placowek (
    id SERIAL PRIMARY KEY,
    tytul VARCHAR(30),
    tresc VARCHAR(1000),
    rspo VARCHAR(10) NOT NULL,
    widoczne BOOLEAN DEFAULT TRUE,
    data_utworzenia TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (rspo) REFERENCES placowki_oswiatowe(rspo)
);
