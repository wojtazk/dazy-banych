import os

from flask import Flask, request, Blueprint, jsonify
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from datetime import timedelta
from flask_cors import CORS

import psycopg2

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
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True
app.config['REMEMBER_COOKIE_DURATION'] = timedelta(days=30)
login_manager = LoginManager()
login_manager.init_app(app)
# login_manager.login_view = 'login'


# database con settings
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", 5342))
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
    def __init__(self, id, username, email, nr_tel, data_utworzenia):
        self.id = id
        self.username = username
        self.email = email
        self.nr_tel = nr_tel
        self.data_utworzenia = data_utworzenia

@login_manager.user_loader
def load_user(user_id):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT id, nazwa_uzytkownika, email, nr_tel, data_utworzenia FROM uzytkownicy WHERE id = %s",
        (user_id,)
    )
    user_data = cur.fetchone()
    cur.close()
    conn.close()

    if user_data:
        return User(*user_data)
    return None

@api_blueprint.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    nazwa = data.get("username")
    haslo = data.get("password")

    if len(haslo) < 8:
        return {"error": "Hasło jest za krótkie."}, 400

    haslo_hash = bcrypt.generate_password_hash(haslo).decode()
    email = data.get("email", None)
    nr_tel = data.get("tel", None)
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
        user_id = cur.fetchone()[0]
        conn.commit()
    except psycopg2.IntegrityError as e:
        return {"error", e}, 400
    finally:
        cur.close()
        conn.close()

    return {"user_id": user_id, "message": "Pomyślnie zarejestrowano"}, 201

@api_blueprint.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    nazwa_uzytkownika = data.get("username")
    haslo = data.get("password")
    zapamietaj_mnie = data.get("rememberme", False)

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT id, nazwa_uzytkownika, email, nr_tel, data_utworzenia, haslo_hash FROM uzytkownicy WHERE nazwa_uzytkownika = %s",
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

    user = User(*user_data[:-1])
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

# register flask blueprints
app.register_blueprint(api_blueprint)

if __name__ == "__main__":
    # run the app
    app.run(debug=True, host="0.0.0.0", port=5000)
