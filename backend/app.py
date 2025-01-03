import os
from datetime import timedelta

import psycopg2
from flask import Flask, request, Blueprint
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user

# initialize flask
app = Flask(__name__)
app.secret_key = 'SHREK FOREVER!!!'

CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# initialize blueprint
api_blueprint = Blueprint('api', __name__, url_prefix='/api')

# initialize bcrypt
app.config["BCRYPT_LOG_ROUNDS"] = 14  # increase bcrypt rounds to 14
bcrypt = Bcrypt(app)
# initialize login
app.config['SESSION_COOKIE_SAMESITE'] = "Strict"  # allo only cookies from the same site
# app.config['SESSION_COOKIE_DOMAIN'] = None
app.config['SESSION_COOKIE_SECURE'] = True
app.config['REMEMBER_COOKIE_DURATION'] = timedelta(days=30)
login_manager = LoginManager()
login_manager.init_app(app)
# login_manager.login_view = 'login'


# database con settings
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", 5432))
DB_NAME = os.getenv("DB_NAME", "nasza_oswiata")
DB_USER = os.getenv("DB_USER", "kot_backendu")
DB_PASSWORD = os.getenv("DB_PASSWORD", "kot_backendu")


def get_db_connection():
    """Establish a database connection."""
    return psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )


##################
## FLASK LOGIN
class User(UserMixin):
    def __init__(self, id, username, email, nr_tel, data_utworzenia, zarzadzane_placowki):
        self.id = id
        self.username = username
        self.email = email
        self.nr_tel = nr_tel
        self.data_utworzenia = data_utworzenia
        self.zarzadzane_placowki = zarzadzane_placowki


@login_manager.user_loader
def load_user(user_id):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT id, nazwa_uzytkownika, email, nr_tel, data_utworzenia FROM uzytkownicy WHERE id = %s",
        (user_id,)
    )
    user_data = cur.fetchone()

    # get all institutions rspos of which the user is an admin
    cur.execute(
        "SELECT COALESCE(json_agg(DISTINCT rspo), '[]') FROM admini_szkoly WHERE uzytkownik_id = %s",
        (user_id,)
    )
    zarzadzane_placowki = cur.fetchone()[0]

    cur.close()
    conn.close()

    if user_data:
        return User(*user_data, zarzadzane_placowki)
    return None


@api_blueprint.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    accept_terms = data.get("accept_terms", False)
    if not accept_terms:
        return {"error": "No dawaj te nery nooo."}, 400

    nazwa = data.get("username")
    if len(nazwa) < 4:
        return {"error": "Nazwa użytkownika jest za krótka."}, 400

    haslo = data.get("password")
    if len(haslo) < 8:
        return {"error": "Hasło jest za krótkie."}, 400

    email = data.get("email", None)
    if not email:
        return {"error": "Adres email jest wymagany."}, 400

    nr_tel = data.get("tel", None)
    if not nr_tel:
        return {"error": "Numer telefonu jest wymagany."}, 400

    haslo_hash = bcrypt.generate_password_hash(haslo).decode()
    id_rola = 3  # zwykly user

    conn = get_db_connection()
    cur = conn.cursor()

    query = """
                INSERT INTO uzytkownicy (nazwa_uzytkownika, haslo_hash, email, nr_tel, id_rola)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id;
                """
    try:
        cur.execute(
            query, (nazwa, haslo_hash, email, nr_tel, id_rola)
        )
        # user_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
    except psycopg2.IntegrityError as e:
        print(e)
        message = str(e)[:str(e).index("DETAIL")]
        return {"error": message}, 400

    return {"message": "Pomyślnie zarejestrowano"}, 201


@api_blueprint.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    nazwa_uzytkownika = data.get("username")
    haslo = data.get("password")
    zapamietaj_mnie = data.get("rememberme", False)

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT id, haslo_hash FROM uzytkownicy WHERE nazwa_uzytkownika = %s",
        (nazwa_uzytkownika,)
    )
    user_data = cur.fetchone()

    if not user_data:
        return {"error": "Użytkownik o podanej nazwie nie istnieje."}, 400

    cur.execute(
        "UPDATE uzytkownicy SET data_ostatniej_proby_logowania = now() WHERE nazwa_uzytkownika = %s",
        (nazwa_uzytkownika,)
    )

    conn.commit()
    cur.close()
    conn.close()

    if not bcrypt.check_password_hash(user_data[-1], haslo):
        return {"error": "Logowanie nie powiodło się."}, 403

    user = load_user(user_data[0])
    login_user(user, remember=zapamietaj_mnie)
    return {"current_user": current_user.__dict__, "message": "Logowanie powiodło się."}, 200


@login_manager.unauthorized_handler
def unauthorized():
    return {"error": "Nieautoryzowany dostęp."}, 401


@api_blueprint.route("/logout", methods=["GET"])
@login_required
def logout():
    logout_user()
    return {"message": "Wylogowano."}, 200


@api_blueprint.route("/user", methods=["GET"])
@login_required
def user_info():
    return {"current_user": current_user.__dict__}, 200


# basic selects for search query parameters
@api_blueprint.route("/miejscowosci", methods=["GET"])
def get_miejscowosci():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT json_agg(row_to_json(t)) FROM miejscowosci as t",
    )
    miejscowosci = cur.fetchone()[0]

    conn.commit()
    cur.close()
    conn.close()

    return {"miejscowosci": miejscowosci}, 200


@api_blueprint.route("/wojewodztwa", methods=["GET"])
def get_wojewodztwa():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT json_agg(row_to_json(t)) FROM wojewodztwa as t",
    )
    wojewodztwa = cur.fetchone()[0]

    conn.commit()
    cur.close()
    conn.close()

    return {"wojewodztwa": wojewodztwa}, 200


@api_blueprint.route("/powiaty", methods=["GET"])
def get_powiaty():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT json_agg(row_to_json(t)) FROM powiaty as t",
    )
    powiaty = cur.fetchone()[0]

    conn.commit()
    cur.close()
    conn.close()

    return {"powiaty": powiaty}, 200


@api_blueprint.route("/gminy", methods=["GET"])
def get_gminy():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT json_agg(row_to_json(t)) FROM gminy as t",
    )
    gminy = cur.fetchone()[0]

    conn.commit()
    cur.close()
    conn.close()

    return {"gminy": gminy}, 200


@api_blueprint.route("/typy_podmiotow", methods=["GET"])
def get_typy_podmiotow():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT json_agg(row_to_json(t)) FROM typy_podmiotow as t",
    )
    typy_podmiotow = cur.fetchone()[0]

    conn.commit()
    cur.close()
    conn.close()

    return {"typy_podmiotow": typy_podmiotow}, 200


@api_blueprint.route("/rodzaje_placowek", methods=["GET"])
def get_rodzaje_placowek():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT json_agg(row_to_json(t)) FROM rodzaje_placowek as t",
    )
    rodzaje_placowek = cur.fetchone()[0]

    conn.commit()
    cur.close()
    conn.close()

    return {"rodzaje_placowek": rodzaje_placowek}, 200


@api_blueprint.route("/specyfiki_szkol", methods=["GET"])
def get_specyfiki_szkol():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT json_agg(row_to_json(t)) FROM specyfiki_szkol as t",
    )
    specyfiki = cur.fetchone()[0]

    conn.commit()
    cur.close()
    conn.close()

    return {"specyfiki_szkol": specyfiki}, 200


@api_blueprint.route("/rodzaje_publicznosci", methods=["GET"])
def get_rodzaje_publicznosci():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT json_agg(row_to_json(t)) FROM rodzaje_publicznosci as t",
    )
    rodzaje_publicznosci = cur.fetchone()[0]

    conn.commit()
    cur.close()
    conn.close()

    return {"rodzaje_publicznosci": rodzaje_publicznosci}, 200


# wyszukiwanie
# SELECT json_agg(row_to_json(t)) FROM wyszukaj_placowki_po_nazwach('nr 10', 'Toruń') as t
@api_blueprint.route("/search", methods=["GET"])
def search():
    query = request.args.get('query') or None
    nazwa_miejscowosci = request.args.get('miejscowosc') or None
    nazwa_wojewodztwa = request.args.get('wojewodztwo') or None
    nazwa_powiatu = request.args.get('powiat') or None
    nazwa_gminy = request.args.get('gmina') or None
    nazwa_typ_podmiotu = request.args.get('typ_podmiotu') or None
    nazwa_rodzaj_placowki = request.args.get('rodzaj_placowki') or None
    nazwa_specyfika_szkoly = request.args.get('specyfika_szkoly') or None
    nazwa_rodzaj_publicznosci = request.args.get('rodzaj_publicznosci') or None

    args = (query, nazwa_miejscowosci, nazwa_wojewodztwa, nazwa_powiatu, nazwa_gminy, nazwa_typ_podmiotu,
            nazwa_rodzaj_placowki, nazwa_specyfika_szkoly, nazwa_rodzaj_publicznosci)

    if all(param is None for param in args):
        return {"error": "Niepoprawne parametry zapytania"}, 400

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT json_agg(row_to_json(t)) FROM wyszukaj_placowki_rozszerzone(%s, %s, %s, %s, %s, %s, %s, %s, %s) as t",
        args,
    )
    search_results = cur.fetchone()[0]

    conn.commit()
    cur.close()
    conn.close()

    return {"search_results": search_results}, 200

@api_blueprint.route("/institution/<string:rspo>", methods=["GET"])
def get_institution_info(rspo):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        "select * from pobierz_informacje_o_placowce(%s)",
        (rspo,),
    )
    institution_info = cur.fetchone()[0]

    conn.commit()
    cur.close()
    conn.close()

    return {"institution_info": institution_info}, 200

@api_blueprint.route("/add_opinion", methods=["POST"])
@login_required
def add_opinion():
    data = request.get_json()

    rspo = data.get('rspo', False)
    if not rspo:
        return {"error": "Nie podano rspo"}, 400

    tresc = data.get('tresc', False)
    if not tresc:
        return {"error": "Nie podano tresci"}, 400

    ocena =data.get('ocena', False)
    if not ocena:
        return {"error": "Nie podano oceny"}, 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            "select * from dodaj_opinie(%s, %s, %s, %s)",
            (current_user.id, rspo, tresc, ocena),
        )
        message = cur.fetchone()[0]

        conn.commit()
        cur.close()
        conn.close()

        return {"message": message}, 201

    except psycopg2.errors.Error as e:
        return {"error": str(e)[:str(e).index("\n")]}, 400


@api_blueprint.route("/add_announcement", methods=["POST"])
@login_required
def add_announcement():
    data = request.get_json()

    rspo = data.get('rspo', False)
    if not rspo:
        return {"error": "Nie podano rspo"}, 400

    tytul = data.get('tytul', False)
    if not tytul:
        return {"error": "Nie podano tytulu"}, 400

    tresc = data.get('tresc', False)
    if not tresc:
        return {"error": "Nie podano tresci"}, 400

    data_wygasniecia = data.get('data_wygasniecia', False)
    print(data_wygasniecia)
    if not data_wygasniecia:
        return {"error": "Nie podano daty wygasniecia"}, 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            "select * from dodaj_ogloszenie_placowki(%s, %s, %s, %s, %s)",
            (current_user.id, rspo, tytul, tresc, data_wygasniecia),
        )
        message = cur.fetchone()[0]

        conn.commit()
        cur.close()
        conn.close()

        return {"message": message}, 201

    except psycopg2.errors.Error as e:
        print(e)
        return {"error": str(e)[:str(e).index("\n")]}, 400

# register flask blueprints
app.register_blueprint(api_blueprint)

if __name__ == "__main__":
    # run the app
    app.run(debug=True, host="0.0.0.0", port=5000)
