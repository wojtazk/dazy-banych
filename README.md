# Dazy Banych - NaszaOświata
[Piosenka o Delta Szwadronie Super Cool Komando Wilków Alpha](https://suno.com/song/59ec1218-c3ac-4a1b-9d84-2e5f0afa4c64)

---

Projekt na bazy danych delta szwadronu super cool komando wilków alfa.

Aplikacja webowa do wyszukiwania oraz oceniania placówek oświatowch, umożliwiająca również publikację komentarzy i ogłoszeń na stronach placówek.

## Drużyna pierścienia
- [Wojtek Kowal](https://github.com/wojtazk)
- [Wojtek Lewko](https://github.com/Atomowyy)
- [Maks Muszyński](https://github.com/Flyyy777)
- [Christopher Kostanecki](https://github.com/Korinv)

## Datasety
- https://dane.gov.pl/en/dataset/839,wykaz-szko-i-placowek-oswiatowych
<!-- - https://dane.gov.pl/en/dataset/1573,pomieszczenia-w-szkoach-boiska-tereny-sportowe-grunty-urzadzenia-rekreacyjno-sportowe -->

![Otwarte Dane zrzut ekranu](https://github.com/user-attachments/assets/589fbfb7-e0d2-4737-859e-a83fd56c5f73)

## Klonowanie repozytorium
```shell
git clone https://github.com/wojtazk/dazy-banych.git
cd dazy-banych
```

## Budowanie i Pierwsze uruchomienie serwisu
> [!NOTE]
> Do zbudowania i uruchomienia serwisu potrzebny jest [Docker](https://docs.docker.com/get-started/get-docker/) i Docker Compose

> [!NOTE]
> Podczas budowania frontend wymaga dostępu do bazy danych i backendu 
```shell
docker-compose up -d --build postgres backend
```
> [!IMPORTANT]
> Poczekaj z budową obrazu frontendu do czasu gdy backend i postgres się podniosą
```shell
docker-compose build frontend
```
```shell
docker-compose up
```

## Uruchamianie serwisu
```shell
docker-compose up
```
Przejdż do serwisu (`http://localhost:80` / `http://127.0.0.1:80`)
```shell
open http://localhost:80
```
![Uruchamianie serwisu zrzut ekranu](https://github.com/user-attachments/assets/bbc330ad-7d63-4743-8374-b6d1996fe3a9)

## Baza danych - Postgres
Uruchamianie samej bazy danych (development):
```shell
docker-compose up postgres 
```
### Informacje
- port: `5432`
```shell
ENV POSTGRES_USER="admin"
ENV POSTGRES_PASSWORD="admin"
ENV POSTGRES_DB="nasza_oswiata"
```
[naszaOswiata.sql](/naszaOswiata.sql) i [load_data.sql](/load_data.sql) to początkowe skrypty inicjalizujące strukturę bazy danych oraz wczytujące dane do tabel z plików csv

## Zarządzanie bazą - pgAdmin
Uruchamianie samego pgAdmina (development):
```shell
docker-compose up pgadmin 
```
### Informacje
- port: `8080`
- użytkownik: `admin@example.com`
- hasło: `admin`
- hasło do połaczenia z bazą: `admin`

```shell
ENV PGADMIN_DEFAULT_EMAIL="admin@example.com"
ENV PGADMIN_DEFAULT_PASSWORD="admin"
ENV PGADMIN_LISTEN_PORT="8080"
```

![Screenshot_20250105_221713](https://github.com/user-attachments/assets/b8f564d3-06f9-4e10-aff0-b0cb3e211563)

> [!NOTE]
> Można dodać `id` jakiegoś użytkownika do tabeli `admini_szkoły`, co pozwoli mu na dodawanie ogłoszeń do danej placówki
```sql
INSERT INTO admini_szkoly VALUES (<user_id>, <placowka_rspo>);
```

## Backend - Flask
Uruchamianie samego backendu (development):
```shell
pip install -r ./backend/requirements.txt
python ./backend/app.py 
```
### Informacje
- port: `5000`

`backend.Dockerfile`
```shell
ENV PORT="5000"
ENV DB_HOST="postgres"
```

`app.py`
```python
# [...]

# database con settings
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", 5432))
DB_NAME = os.getenv("DB_NAME", "nasza_oswiata")
DB_USER = os.getenv("DB_USER", "kot_backendu")
DB_PASSWORD = os.getenv("DB_PASSWORD", "kot_backendu")

# [...]

if __name__ == "__main__":
    # run the app
    app.run(debug=False, host="0.0.0.0", port=int(os.getenv("PORT", 5000)))
```

## Frontend - Next.js
Uruchamianie samego frontendu (development):
```shell
npm install
npm run dev
```
### Informacje
- port: `80`
- port development: `3000`

`frontend.Dockerfile`
```shell
ENV NODE_ENV="production"
ENV PORT="3000"
ENV BACKEND_URL="http://backend:5000"
```

`next.config.mjs`
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {  // proxy for backend server
        return [
          {
            source: '/proxy/:path*',
            destination: `${process.env.BACKEND_URL || 'http://192.168.0.136:5000'}/:path*`,
          },
        ];
      },
};

export default nextConfig;
```
<br>

Obrazy w awatarze użytkownika są pobierane z https://picsum.photos/

![Wyszukiwarka](https://github.com/user-attachments/assets/1ee233ff-7d01-4bcf-bab2-810a94af4e25)
![Wyszukiwarka - filtry](https://github.com/user-attachments/assets/b0058dd8-a154-4e7d-a6da-418757e62ed6)
![Rejestracja](https://github.com/user-attachments/assets/b12f92b4-ef23-405b-a660-56c897e6405c)
![Logowanie](https://github.com/user-attachments/assets/8ba2ca5e-cf1c-44ca-96bb-0b06378e2aaf)
![Strona placówki](https://github.com/user-attachments/assets/18fcbf43-c0b0-4219-8c83-a8d89fe05017)
![Dodawanie ogłoszenia](https://github.com/user-attachments/assets/e43117b5-caa1-4afd-8c7a-44992e9e7413)
![Ogłoszenia](https://github.com/user-attachments/assets/283260c0-7c77-4567-9193-1a88c29326a1)
![Opinie](https://github.com/user-attachments/assets/6ccbfe53-f3b9-4e5c-87d8-0cc348bd6d6f)
![Dodaj opinie](https://github.com/user-attachments/assets/7dbdb865-64a3-4303-9692-c727233d259d)
![Użytkownik popover](https://github.com/user-attachments/assets/309391da-6fec-47c6-86d5-a78973e2f43e)
![Strona użytkownika](https://github.com/user-attachments/assets/a3859d42-141b-4528-867c-eac3e81e1794)
![Modal](https://github.com/user-attachments/assets/d0432ce4-c11e-4db9-8808-78da1651df9d)

![not-found.js](https://github.com/user-attachments/assets/1b2374dd-25c1-46ff-907e-05458ba6f269)
Strona not-found pobiera kotki z https://cataas.com

![Darkmode](https://github.com/user-attachments/assets/64b41771-3b14-425a-bf5f-1d16c0c6c718)
