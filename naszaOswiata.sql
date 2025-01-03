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
    id_rola INTEGER NOT NULL DEFAULT 3,
    data_utworzenia TIMESTAMPTZ DEFAULT now(),
    data_ostatniej_proby_logowania TIMESTAMPTZ,
    FOREIGN KEY (id_rola) REFERENCES role(id),

    CONSTRAINT uzytkownicy_nazwa_uzytkownika_min_dlugosc_constraint CHECK (
        char_length(nazwa_uzytkownika) >= 4
    ),

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
    RETURN OLD;
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
-- Sprawdzanie czy użytkownik nie przekroczył już limitu dodanych opinii
CREATE OR REPLACE FUNCTION limit_opinii_dla_uzytkownika()
RETURNS TRIGGER AS $$
DECLARE
    liczba_opinii INT;
BEGIN
    SELECT COUNT(*)
      INTO liczba_opinii
      FROM opinie
     WHERE uzytkownik_id = NEW.uzytkownik_id;

    IF liczba_opinii >= 10 THEN
        RAISE EXCEPTION 'Użytkownik (ID=%) osiągnął limit 10 opinii i nie może dodać kolejnej.',
            NEW.uzytkownik_id
            USING ERRCODE = 'check_violation';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER limit_opinii_before_insert
BEFORE INSERT ON opinie
FOR EACH ROW
EXECUTE FUNCTION limit_opinii_dla_uzytkownika();
------------------------------------------------------------------------
-- sprawdzanie czy użytkownik nie dodał już opinii do danej placówki
CREATE OR REPLACE FUNCTION enforce_one_opinion_per_school()
RETURNS TRIGGER AS $$
DECLARE
    cnt INT;
BEGIN
    SELECT COUNT(*)
      INTO cnt
      FROM opinie
     WHERE uzytkownik_id = NEW.uzytkownik_id
       AND rspo = NEW.rspo;

    IF cnt > 0 THEN
        RAISE EXCEPTION 'Użytkownik (ID=%) posiada już opinię do placówki (rspo=%).',
            NEW.uzytkownik_id,
            NEW.rspo
            USING ERRCODE = 'check_violation';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_one_opinion_per_school
BEFORE INSERT ON opinie
FOR EACH ROW
EXECUTE FUNCTION enforce_one_opinion_per_school();
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
            COALESCE(ts_rank_cd(
                to_tsvector('simple', p.nazwa_placowki),
                to_tsquery('simple', query_text)
            ), 0) AS rank
        FROM placowki_oswiatowe AS p
        WHERE to_tsvector('simple', p.nazwa_placowki) @@ plainto_tsquery('simple', query_text)
        ORDER BY rank DESC LIMIT 50;
END;
$$;

-- zaawansowanie wyszukiwanie
CREATE OR REPLACE FUNCTION wyszukaj_placowki_rozszerzone(
    _query_text TEXT DEFAULT NULL,
    _id_miejscowosc         INT        DEFAULT NULL,
    _id_wojewodztwo         VARCHAR(2) DEFAULT NULL,
    _id_powiat              VARCHAR(4) DEFAULT NULL,
    _id_gmina               VARCHAR(7) DEFAULT NULL,
    _id_typ_podmiotu        INT        DEFAULT NULL,
    _id_rodzaj_placowki     INT        DEFAULT NULL,
    _id_specyfika_szkoly    INT        DEFAULT NULL,
    _id_rodzaj_publicznosci INT     DEFAULT NULL
)
RETURNS TABLE (
    rspo                      VARCHAR(10),
    nazwa_placowki            TEXT,
    nazwa_typ_podmiotu        VARCHAR(100),
    nazwa_rodzaj_placowki     VARCHAR(100),
    nazwa_specyfika_szkoly    VARCHAR(50),
    nazwa_rodzaj_publicznosci VARCHAR(100),
    nazwa_wojewodztwa         VARCHAR(50),
    nazwa_powiatu             VARCHAR(50),
    nazwa_gminy               VARCHAR(50),
    nazwa_miejscowosci        VARCHAR(50),
    rank                      REAL
)
LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
    SELECT
        p.rspo,
        p.nazwa_placowki,
        t.nazwa  AS nazwa_typ_podmiotu,
        ro.nazwa AS nazwa_rodzaj_placowki,
        s.nazwa  AS nazwa_specyfika_szkoly,
        rp.nazwa AS nazwa_rodzaj_publicznosci,
        w.nazwa  AS nazwa_wojewodztwa,
        po.nazwa AS nazwa_powiatu,
        g.nazwa  AS nazwa_gminy,
        m.nazwa  AS nazwa_miejscowosci,

        -- ranga full-text search (jeśli _query_text nie jest pusty/NULL)
        COALESCE(
            ts_rank_cd(
                to_tsvector('simple', p.nazwa_placowki),
                plainto_tsquery('simple', _query_text)
            ),
            0
        ) AS rank

    FROM placowki_oswiatowe p
         JOIN typy_podmiotow            t  ON p.id_typ_podmiotu         = t.id
         JOIN rodzaje_placowek          ro ON p.id_rodzaj_placowki      = ro.id
         JOIN specyfiki_szkol           s  ON p.id_specyfika_szkoly     = s.id
         JOIN rodzaje_publicznosci      rp ON p.id_rodzaj_publicznosci  = rp.id
         JOIN adresy                    a  ON p.rspo                    = a.rspo
         JOIN wojewodztwa               w  ON a.id_wojewodztwo          = w.id
         JOIN powiaty                   po ON a.id_powiat               = po.id
         JOIN gminy                     g  ON a.id_gmina                = g.id
         JOIN miejscowosci              m  ON a.id_miejscowosc          = m.id

    WHERE
        -- jeżeli nie podano _query_text (lub jest pusty), pomijamy filtr full-text
        (
           _query_text IS NULL
           OR _query_text = ''
           OR to_tsvector('simple', p.nazwa_placowki)
              @@ plainto_tsquery('simple', _query_text)
        )

        -- filtry opcjonalne na województwo, powiat, gminę, miejscowość
        AND (
            _id_wojewodztwo IS NULL
            OR a.id_wojewodztwo = _id_wojewodztwo
        )
        AND (
            _id_powiat IS NULL
            OR a.id_powiat = _id_powiat
        )
        AND (
            _id_gmina IS NULL
            OR a.id_gmina = _id_gmina
        )
        AND (
            _id_miejscowosc IS NULL
            OR a.id_miejscowosc = _id_miejscowosc
        )

        -- filtr opcjonalny na typ podmiotu
        AND (
            _id_typ_podmiotu IS NULL
            OR p.id_typ_podmiotu = _id_typ_podmiotu
        )

        -- filtr opcjonalny na rodzaj placówki
        AND (
            _id_rodzaj_placowki IS NULL
            OR p.id_rodzaj_placowki = _id_rodzaj_placowki
        )

        -- filtr opcjonalny na specyfikę szkoły
        AND (
            _id_specyfika_szkoly IS NULL
            OR p.id_specyfika_szkoly = _id_specyfika_szkoly
        )

        -- filtr opcjonalny na rodzaj publiczności
        AND (
            _id_rodzaj_publicznosci IS NULL
            OR p.id_rodzaj_publicznosci = _id_rodzaj_publicznosci
        )

    ORDER BY
        rank DESC,
        p.nazwa_placowki
    LIMIT 300;
END;
$$;
-- CREATE OR REPLACE FUNCTION wyszukaj_placowki_rozszerzone(
--     _query_text TEXT DEFAULT NULL,
--     _nazwa_miejscowosc         TEXT DEFAULT NULL,
--     _nazwa_wojewodztwo         TEXT DEFAULT NULL,
--     _nazwa_powiat              TEXT DEFAULT NULL,
--     _nazwa_gmina               TEXT DEFAULT NULL,
--     _nazwa_typ_podmiotu        TEXT DEFAULT NULL,
--     _nazwa_rodzaj_placowki     TEXT DEFAULT NULL,
--     _nazwa_specyfika_szkoly    TEXT DEFAULT NULL,
--     _nazwa_rodzaj_publicznosci TEXT DEFAULT NULL
-- )
-- RETURNS TABLE (
--     rspo                      VARCHAR(10),
--     nazwa_placowki            TEXT,
--     nazwa_typ_podmiotu        VARCHAR(100),
--     nazwa_rodzaj_placowki     VARCHAR(100),
--     nazwa_specyfika_szkoly    VARCHAR(50),
--     nazwa_rodzaj_publicznosci VARCHAR(100),
--     nazwa_wojewodztwa         VARCHAR(50),
--     nazwa_powiatu             VARCHAR(50),
--     nazwa_gminy               VARCHAR(50),
--     nazwa_miejscowosci        VARCHAR(50),
--     rank                      REAL
-- )
-- LANGUAGE plpgsql
-- AS
-- $$
-- BEGIN
--     RETURN QUERY
--     SELECT
--         p.rspo,
--         p.nazwa_placowki,
--         t.nazwa  AS nazwa_typ_podmiotu,
--         ro.nazwa AS nazwa_rodzaj_placowki,
--         s.nazwa  AS nazwa_specyfika_szkoly,
--         rp.nazwa AS nazwa_rodzaj_publicznosci,
--         w.nazwa  AS nazwa_wojewodztwa,
--         po.nazwa AS nazwa_powiatu,
--         g.nazwa  AS nazwa_gminy,
--         m.nazwa  AS nazwa_miejscowosci,
--
--         -- ranga full-text search (jeśli _query_text nie jest pusty/NULL)
--         COALESCE(
--             ts_rank_cd(
--                 to_tsvector('simple', p.nazwa_placowki),
--                 plainto_tsquery('simple', _query_text)
--             ),
--             0
--         ) AS rank
--
--     FROM placowki_oswiatowe p
--          JOIN typy_podmiotow            t  ON p.id_typ_podmiotu             = t.id
--          JOIN rodzaje_placowek          ro ON p.id_rodzaj_placowki          = ro.id
--          JOIN specyfiki_szkol           s  ON p.id_specyfika_szkoly         = s.id
--          JOIN rodzaje_publicznosci      rp ON p.id_rodzaj_publicznosci      = rp.id
--          JOIN adresy                    a  ON p.rspo                        = a.rspo
--          JOIN wojewodztwa               w   ON a.id_wojewodztwo             = w.id
--          JOIN powiaty                   po  ON a.id_powiat                  = po.id
--          JOIN gminy                     g   ON a.id_gmina                   = g.id
--          JOIN miejscowosci              m   ON a.id_miejscowosc             = m.id
--
--     WHERE
--         (
--            _query_text IS NULL
--            OR _query_text = ''
--            OR to_tsvector('simple', p.nazwa_placowki)
--               @@ plainto_tsquery('simple', _query_text)
--         )
--
--         AND (
--             _nazwa_wojewodztwo IS NULL
--             OR w.nazwa = _nazwa_wojewodztwo
--         )
--         AND (
--             _nazwa_powiat IS NULL
--             OR po.nazwa = _nazwa_powiat
--         )
--         AND (
--             _nazwa_gmina IS NULL
--             OR g.nazwa = _nazwa_gmina
--         )
--         AND (
--             _nazwa_miejscowosc IS NULL
--             OR m.nazwa = _nazwa_miejscowosc
--         )
--         AND (
--             _nazwa_typ_podmiotu IS NULL
--             OR t.nazwa = _nazwa_typ_podmiotu
--         )
--         AND (
--             _nazwa_rodzaj_placowki IS NULL
--             OR ro.nazwa = _nazwa_rodzaj_placowki
--         )
--         AND (
--             _nazwa_specyfika_szkoly IS NULL
--             OR s.nazwa = _nazwa_specyfika_szkoly
--         )
--         AND (
--             _nazwa_rodzaj_publicznosci IS NULL
--             OR rp.nazwa = _nazwa_rodzaj_publicznosci
--         )
--
--     ORDER BY
--         rank DESC,
--         p.nazwa_placowki
--     LIMIT 300;
-- END;
-- $$;

-- Function for gettin info about school
CREATE OR REPLACE FUNCTION pobierz_informacje_o_placowce(_rspo VARCHAR(10))
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    wynik JSONB;
BEGIN
    /*
        pobieramy informacje
        o samej placówce (nazwa, typ podmiotu, rodzaj placówki itp.),
        a także jej adres (ulica, miejscowość, województwo itd.)
        i dane kontaktowe.
    */
    WITH placowka_info AS (
        SELECT
            p.rspo,
            p.regon,
            p.nazwa_placowki,
            t.nazwa   AS typ_podmiotu,
            ro.nazwa  AS rodzaj_placowki,
            ku.nazwa  AS kategoria_uczniow,
            rp.nazwa  AS rodzaj_publicznosci,
            ss.nazwa  AS specyfika_szkoly,
            top.nazwa AS typ_organu_prowadzacego,

            COALESCE(
                (
                    SELECT json_agg(op.nazwa) FROM organy_prowadzace op LEFT JOIN placowki_organy_prowadzace pop ON op.id = pop.id_organ_prowadzacy WHERE pop.rspo = p.rspo
                ),
                '[]'
            ) AS organy_prowadzace,

            p.liczba_uczniow_ogolem,
            p.liczba_uczennic,

            a.ulica,
            a.numer_domu,
            a.numer_lokalu,
            k.kod      AS kod_pocztowy,
            m.nazwa    AS miejscowosc,
            w.nazwa    AS wojewodztwo,
            po.nazwa   AS powiat,
            g.nazwa    AS gmina,

            d.nr_tel,
            d.email,
            d.strona_www

        FROM placowki_oswiatowe p
        LEFT JOIN typy_podmiotow            t       ON p.id_typ_podmiotu             = t.id
        LEFT JOIN rodzaje_placowek          ro      ON p.id_rodzaj_placowki          = ro.id
        LEFT JOIN kategorie_uczniow         ku      ON p.id_kategoria_uczniow        = ku.id
        LEFT JOIN rodzaje_publicznosci      rp      ON p.id_rodzaj_publicznosci      = rp.id
        LEFT JOIN specyfiki_szkol           ss      ON p.id_specyfika_szkoly         = ss.id
        LEFT JOIN typy_organow_prowadzacych top     ON p.id_typ_organu_prowadzacego  = top.id

        LEFT JOIN adresy a           ON p.rspo              = a.rspo
        LEFT JOIN kody_pocztowe k    ON a.id_kod_pocztowy   = k.id
        LEFT JOIN miejscowosci m     ON a.id_miejscowosc    = m.id
        LEFT JOIN wojewodztwa w      ON a.id_wojewodztwo    = w.id
        LEFT JOIN powiaty po         ON a.id_powiat         = po.id
        LEFT JOIN gminy   g          ON a.id_gmina          = g.id

        LEFT JOIN dane_kontaktowe d  ON p.rspo              = d.rspo

        WHERE p.rspo = _rspo
        LIMIT 1
    ),

    /*
        zbieramy wszystkie ogłoszenia z tabeli
        `ogloszenia_placowek`, które są:
        - widoczne = TRUE
        - oraz data_wygasniecia >= teraz (ogłoszenie niewygasłe).
        Zwracamy je jako tablicę JSON (json_agg).
    */
    ogloszenia_info AS (
        SELECT
            COALESCE(
                json_agg(
                    json_build_object(
                        'id', o.id,
                        'tytul', o.tytul,
                        'tresc', o.tresc,
                        'data_utworzenia', o.data_utworzenia,
                        'data_wygasniecia', o.data_wygasniecia
                    )
                    ORDER BY o.data_utworzenia DESC
                ),
                '[]'::json
            ) AS ogloszenia
        FROM ogloszenia_placowek o
        WHERE o.rspo = _rspo
          AND o.widoczne = TRUE
          AND o.data_wygasniecia >= now()
    ),

    /*
        pobieramy wszystkie opinie widoczne (widoczna = TRUE)
        i zwracamy je w formacie JSON. Dołączamy nazwę użytkownika (o ile istnieje;
        jeśli użytkownik został usunięty, nazwa może być NULL – można wtedy użyć COALESCE).
    */
    opinie_info AS (
        SELECT
            COALESCE(
                json_agg(
                    json_build_object(
                        'id', op.id,
                        'ocena', op.ocena,
                        'tresc', op.tresc,
                        'data_utworzenia', op.data_utworzenia,
                        'autor', COALESCE(u.nazwa_uzytkownika, 'Usunięty')
                    )
                    ORDER BY op.data_utworzenia DESC
                ),
                '[]'::json
            ) AS opinie
        FROM opinie op
        LEFT JOIN uzytkownicy u ON op.uzytkownik_id = u.id
        WHERE op.rspo = _rspo
          AND op.widoczna = TRUE
    ),

    -- srednia z wystawionych ocen
    srednia_ocena AS (
        SELECT
            COALESCE(ROUND(AVG(op.ocena)::numeric, 1), 0) AS avg_ocena
        FROM opinie op
        WHERE op.rspo = _rspo
          AND op.widoczna = TRUE
    )

    -- zwracamy polaczenie poprzednich zapytan
    SELECT jsonb_build_object(
        'placowka',
            to_jsonb(pi),  -- podstawowe info o placówce (z placowka_info)
            -- - 'rspo',     -- ewentualnie można wykluczyć klucze, których nie chcemy w JSON
        'ogloszenia', oi.ogloszenia,   -- tablica z ogłoszeniami
        'opinie',     oi2.opinie,      -- tablica z opiniami
        'srednia_ocena', soc.avg_ocena
    )
    INTO wynik
    FROM placowka_info pi
    CROSS JOIN ogloszenia_info oi
    CROSS JOIN opinie_info     oi2
    CROSS JOIN srednia_ocena   soc;

    RETURN wynik;
END;
$$;

-- funkcja do dodawania opinii
CREATE OR REPLACE FUNCTION dodaj_opinie(
    _uzytkownik_id INTEGER,
    _rspo VARCHAR(10),
    _tresc VARCHAR(200),
    _ocena NUMERIC(3,1)  -- ocena od 1 do 10, krok 0.5 (pokrywa CHECK w tabeli)
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    new_opinia_id INTEGER;
BEGIN
    INSERT INTO opinie (uzytkownik_id, rspo, tresc, ocena)
    VALUES (_uzytkownik_id, _rspo, _tresc, _ocena)
    RETURNING id INTO new_opinia_id;

    RETURN format('Pomyślnie dodano opinię. ID: %s', new_opinia_id);
END;
$$;

-- funkcja do usuwania opinii
CREATE OR REPLACE FUNCTION usun_opinie(
    _uzytkownik_id INTEGER,  -- ID użytkownika próbującego usunąć opinię
    _opinia_id     INTEGER   -- ID opinii do usunięcia
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM opinie
     WHERE id = _opinia_id
       AND uzytkownik_id = _uzytkownik_id;

    IF NOT FOUND THEN
        RETURN format(
            'Brak opinii o ID=%s lub brak uprawnień do jej usunięcia (użytkownik: %s).',
            _opinia_id, _uzytkownik_id
        );
    ELSE
        RETURN format(
            'Opinia o ID=%s (użytkownik_id=%s) została usunięta.',
            _opinia_id, _uzytkownik_id
        );
    END IF;
END;
$$;


-- funkcja do dodawania ogłoszenia
CREATE OR REPLACE FUNCTION dodaj_ogloszenie_placowki(
    _uzytkownik_id    INTEGER,
    _rspo            VARCHAR(10),
    _tytul           VARCHAR(30),
    _tresc           VARCHAR(1000),
    _data_wygasniecia TIMESTAMPTZ DEFAULT (now() + INTERVAL '31 days')
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    is_admin BOOLEAN;
    new_announcement_id INTEGER;
BEGIN
    SELECT EXISTS(
        SELECT 1
          FROM admini_szkoly
         WHERE uzytkownik_id = _uzytkownik_id
           AND rspo = _rspo
    )
    INTO is_admin;

    IF NOT is_admin THEN
        RAISE EXCEPTION
            'Brak uprawnień: użytkownik (ID=%s) nie jest administratorem placówki (rspo=%s).',
            _uzytkownik_id, _rspo
            USING ERRCODE = 'check_violation';
    END IF;

    INSERT INTO ogloszenia_placowek (
        tytul,
        tresc,
        rspo,
        data_wygasniecia
    )
    VALUES (
        _tytul,
        _tresc,
        _rspo,
        _data_wygasniecia::timestamptz
    )
    RETURNING id INTO new_announcement_id;

    RETURN format(
        'Utworzono ogłoszenie o ID=%s dla placówki (rspo=%s) przez użytkownika (ID=%s).',
        new_announcement_id,
        _rspo,
        _uzytkownik_id
    );
END;
$$;

-- funkcja pobierajaca wszystkie komentarze uzytkownika
CREATE OR REPLACE FUNCTION pobierz_opinie_uzytkownika_json(
    _uzytkownik_id INT
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    wynik JSONB;
BEGIN
    SELECT COALESCE(
        json_agg(
            json_build_object(
                'id',               o.id,
                'tresc',            o.tresc,
                'ocena',            o.ocena,
                'data_utworzenia',  o.data_utworzenia,
                'rspo',             o.rspo,
                'nazwa_placowki',   p.nazwa_placowki
            )
            ORDER BY o.data_utworzenia DESC
        ),
        '[]'::json
    )
    INTO wynik
    FROM opinie o
    JOIN placowki_oswiatowe p ON o.rspo = p.rspo
    WHERE o.uzytkownik_id = _uzytkownik_id;

    RETURN wynik;
END;
$$;



------------------------------------------------------------------------
-- Create username for backend
CREATE USER kot_backendu WITH PASSWORD 'kot_backendu';
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO kot_backendu;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO kot_backendu;
-- zezwala na inkrementacje primary key w uzytkownikacj
GRANT USAGE, SELECT, UPDATE ON SEQUENCE uzytkownicy_id_seq TO kot_backendu;
GRANT USAGE, SELECT, UPDATE ON SEQUENCE opinie_id_seq TO kot_backendu;
GRANT USAGE, SELECT, UPDATE ON SEQUENCE ogloszenia_placowek_id_seq TO kot_backendu;
