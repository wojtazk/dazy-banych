-- Tabele podstawowe
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

-- placowki_oswiatowe indexy
CREATE INDEX idx_placowki_oswiatowe_nazwa_placowki ON placowki_oswiatowe USING gin (
    to_tsvector('simple', nazwa_placowki)
);

CREATE INDEX idx_placowki_id_typ_podmiotu ON placowki_oswiatowe (id_typ_podmiotu);
CREATE INDEX idx_placowki_id_rodzaj_placowki ON placowki_oswiatowe (id_rodzaj_placowki);
CREATE INDEX idx_placowki_id_kategoria_uczniow ON placowki_oswiatowe (id_kategoria_uczniow);
CREATE INDEX idx_placowki_id_rodzaj_publicznosci ON placowki_oswiatowe (id_rodzaj_publicznosci);
CREATE INDEX idx_placowki_id_specyfika_szkoly ON placowki_oswiatowe (id_specyfika_szkoly);
CREATE INDEX idx_placowki_id_typ_organu_prowadzacego ON placowki_oswiatowe (id_typ_organu_prowadzacego);
CREATE INDEX idx_placowki_id_podmiot_glowny ON placowki_oswiatowe (id_podmiot_glowny);
CREATE INDEX idx_placowki_id_podmiot_nadrzedny ON placowki_oswiatowe (id_podmiot_nadrzedny);
--

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

-- adresy - indexy
CREATE INDEX idx_adresy_kod_pocztowy ON adresy (id_kod_pocztowy);
CREATE INDEX idx_adresy_miejscowosc ON adresy (id_miejscowosc);
CREATE INDEX idx_adresy_wojewodztwo ON adresy (id_wojewodztwo);
CREATE INDEX idx_adresy_powiat ON adresy (id_powiat);
CREATE INDEX idx_adresy_gmina ON adresy (id_gmina);
--

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
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    nazwa VARCHAR(20) UNIQUE NOT NULL
);
INSERT INTO role (nazwa) VALUES ('administrator'), ('administrator_szkoly'), ('zwykly_uzytkownik'), ('moderator'), ('zbanowany'), ('usuniety');

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

    -- sprawdzenie czy data ostatniego logowania jest pozniej niz data utworzenia
    CONSTRAINT uzytkownicy_data_ostatniej_proby_logowania_constraint CHECK (
        data_ostatniej_proby_logowania >= data_utworzenia
        OR data_ostatniej_proby_logowania IS NULL
    )
);

CREATE TABLE admini_szkoly (
    uzytkownik_id INTEGER,
    rspo VARCHAR(10) NOT NULL,
    FOREIGN KEY (uzytkownik_id) REFERENCES uzytkownicy(id) ON DELETE CASCADE,
    FOREIGN KEY (rspo) REFERENCES placowki_oswiatowe(rspo)
);

-- admini_szkoly indexy
CREATE INDEX idx_admini_szkoly_rspo  ON admini_szkoly(rspo);
CREATE INDEX idx_admini_szkoly_uzytkownik_id ON admini_szkoly(uzytkownik_id);
--

CREATE TABLE opinie (
    id SERIAL PRIMARY KEY,
    tresc VARCHAR(200) NOT NULL,
    ocena INTEGER NOT NULL,
    uzytkownik_id INTEGER NOT NULL,
    rspo VARCHAR(10) NOT NULL,
    zweryfikowana BOOLEAN DEFAULT FALSE,
    widoczna BOOLEAN DEFAULT TRUE,
    data_utworzenia TIMESTAMPTZ DEFAULT now(),

    FOREIGN KEY (uzytkownik_id) REFERENCES uzytkownicy(id) ON DELETE CASCADE,
    FOREIGN KEY (rspo) REFERENCES placowki_oswiatowe(rspo),

    -- ocena powinna miec wartosc od 1 do 10 w inkrementach po 0.5
    CONSTRAINT opinie_ocena_constraint CHECK (
        ocena >= 1
        AND ocena <= 10
        AND ocena * 2 = FLOOR(ocena * 2)
    )
);

-- opinie indexy
CREATE INDEX idx_opinie_uzytkownik_id ON opinie(uzytkownik_id);
CREATE INDEX idx_opinie_rspo_widoczna ON opinie(rspo) WHERE widoczna = true;
--

CREATE TABLE usuniete_opinie (
    opinia_id INTEGER PRIMARY KEY,
    dane JSONB NOT NULL
);

CREATE TABLE zgloszone_opinie (
    id SERIAL PRIMARY KEY,
    id_opinii INTEGER NOT NULL,
    uzytkownik_id INTEGER NOT NULL,
    data_zgloszenia TIMESTAMPTZ DEFAULT now(),

    FOREIGN KEY (id_opinii) REFERENCES opinie(id),
    FOREIGN KEY (uzytkownik_id) REFERENCES uzytkownicy(id)
);

-- zgloszone_opinie indexy
CREATE INDEX idx_zgloszone_opinie_id_opinii ON zgloszone_opinie(id_opinii);
CREATE INDEX idx_zgloszone_opinie_uzytkownik_id ON zgloszone_opinie(uzytkownik_id);
--

CREATE TABLE kategorie_ogloszen_uzytkownikow (
    id SERIAL PRIMARY KEY,
    nazwa VARCHAR(20)
);

CREATE TABLE ogloszenia_uzytkownikow (
    id SERIAL PRIMARY KEY,
    tytul VARCHAR(30),
    tresc VARCHAR(1000),
    id_kategoria INTEGER NOT NULL,
    uzytkownik_id INTEGER NOT NULL,
    rspo VARCHAR(10) NOT NULL,
    zatwierdzone BOOLEAN DEFAULT FALSE,
    widoczne BOOLEAN DEFAULT TRUE,
    data_utworzenia TIMESTAMPTZ DEFAULT now(),
    data_wygasniecia TIMESTAMPTZ DEFAULT now() + INTERVAL '31 days',

    CONSTRAINT ogloszenia_uztkownikow_data_wygasniecia_check CHECK (
        data_wygasniecia >= now()
        AND data_wygasniecia <= now() + INTERVAL '31 days'
    ),

    FOREIGN KEY (uzytkownik_id) REFERENCES uzytkownicy(id) ON DELETE CASCADE,
    FOREIGN KEY (rspo) REFERENCES placowki_oswiatowe(rspo),
    FOREIGN KEY (id_kategoria) REFERENCES kategorie_ogloszen_uzytkownikow(id)
);

-- ogloszenia_uzytkownikow indexy
CREATE INDEX idx_ogloszenia_uzytkownik_id ON ogloszenia_uzytkownikow(uzytkownik_id);
CREATE INDEX idx_ogloszenia_rspo ON ogloszenia_uzytkownikow(rspo) WHERE zatwierdzone = true;
CREATE INDEX idx_ogloszenia_id_kategoria ON ogloszenia_uzytkownikow(id_kategoria) WHERE zatwierdzone = true;
--

CREATE TABLE ogloszenia_placowek (
    id SERIAL PRIMARY KEY,
    tytul VARCHAR(30),
    tresc VARCHAR(1000),
    rspo VARCHAR(10) NOT NULL,
    widoczne BOOLEAN DEFAULT TRUE,
    data_utworzenia TIMESTAMPTZ DEFAULT now(),
    data_wygasniecia TIMESTAMPTZ DEFAULT now() + INTERVAL '31 days',

    CONSTRAINT ogloszenia_placowek_data_wygasniecia_check CHECK (
        data_wygasniecia >= now()
        AND data_wygasniecia <= now() + INTERVAL '31 days'
    ),

    FOREIGN KEY (rspo) REFERENCES placowki_oswiatowe(rspo) ON DELETE CASCADE
);

-- ogloszenia_placowek indexy
CREATE INDEX idx_ogloszenia_placowek_rspo ON ogloszenia_placowek(rspo) WHERE widoczne = true;
--

-- Tabela z logami dla placowki_oswiatowe
CREATE TABLE placowki_oswiatowe_log (
    id SERIAL PRIMARY KEY,
    rspo VARCHAR(10) NOT NULL,
    rodzaj_operacji VARCHAR(10) NOT NULL,
    data_modyfikacji TIMESTAMPTZ NOT NULL DEFAULT now(),
    stare_dane JSONB,
    nowe_dane JSONB,

    FOREIGN KEY (rspo) REFERENCES placowki_oswiatowe(rspo)
);


------------------------------------------------------------------------
-- Triggers

------------------------------------------------------------------------
-- Funkcja do zapisywania logowow dla placowek oswiatowych
CREATE OR REPLACE FUNCTION placowki_oswiatowe_logger() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO placowki_oswiatowe_log (rspo, rodzaj_operacji, nowe_dane)
        VALUES (NEW.rspo, 'INSERT', row_to_json(NEW));
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO placowki_oswiatowe_log (rspo, rodzaj_operacji, stare_dane, nowe_dane)
        VALUES (OLD.rspo, 'UPDATE', row_to_json(OLD), row_to_json(NEW));
    ELSEIF TG_OP = 'DELETE' THEN
        INSERT INTO placowki_oswiatowe_log (rspo, rodzaj_operacji, stare_dane)
        VALUES (OLD.rspo, 'DELETE', row_to_json(OLD));
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger do wywolywania funkcji do logowania zmian
CREATE TRIGGER placowki_oswiatowe_log_trigger
AFTER INSERT OR UPDATE OR DELETE ON placowki_oswiatowe
FOR EACH ROW
EXECUTE FUNCTION placowki_oswiatowe_logger();

------------------------------------------------------------------------
-- Zapisywanie usunietych opinii do tabeli usuniete_opinie
CREATE OR REPLACE FUNCTION log_usuniete_opinie()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO usuniete_opinie (opinia_id, dane)
    VALUES (OLD.id, row_to_json(OLD));
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_delete_opinia_trigger
BEFORE DELETE ON opinie
FOR EACH ROW
EXECUTE FUNCTION log_usuniete_opinie();
------------------------------------------------------------------------
-- Ukrywanie opinii gdy liczba zgloszen przekroczy 3
CREATE OR REPLACE FUNCTION zgloszenia_opinii_check()
RETURNS TRIGGER AS $$
DECLARE
    liczba_zgloszen INT;
BEGIN
    SELECT COUNT(*) INTO liczba_zgloszen
    FROM zgloszone_opinie
    WHERE id_opinii = NEW.id_opinii;

    IF liczba_zgloszen >= 3 THEN
        UPDATE opinie
           SET widoczna = false
         WHERE id = NEW.id_opinii
           AND widoczna = true;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ukrywanie_opinii_trigger
AFTER INSERT ON zgloszone_opinie
FOR EACH ROW
EXECUTE FUNCTION zgloszenia_opinii_check();
------------------------------------------------------------------------
-- Uwidacznianie opini po zweryfikowaniu jej
CREATE OR REPLACE FUNCTION weryfikacja_opinii()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.zweryfikowana = true THEN
    NEW.widoczna := true;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER weryfikacja_opinii_trigger
BEFORE UPDATE ON opinie
FOR EACH ROW
EXECUTE FUNCTION weryfikacja_opinii();
------------------------------------------------------------------------

------------------------------------------------------------------------
-- functions

-- wyszukiwanie nazwy placowki
CREATE OR REPLACE FUNCTION wyszukaj_placowke_po_nazwie(query_text text)
RETURNS TABLE (
  rspo VARCHAR(10),
  nazwa_placowki TEXT,
  rank REAL
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
        SELECT
            p.rspo,
            p.nazwa_placowki,
            ts_rank_cd(
            to_tsvector('simple', p.nazwa_placowki),
            to_tsquery('simple', query_text)
            ) AS rank
        FROM placowki_oswiatowe AS p
        WHERE to_tsvector('simple', p.nazwa_placowki) @@ plainto_tsquery('simple', query_text)
        ORDER BY rank DESC LIMIT 50;
END;
$$;
