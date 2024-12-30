FROM postgres:17.2-bookworm

ENV POSTGRES_USER="admin"
ENV POSTGRES_PASSWORD="admin"
ENV POSTGRES_DB="nasza_oswiata"

COPY ./podzielone_datasety /datasets
RUN chown -R postgres:postgres /datasets

COPY ./naszaOswiata.sql /docker-entrypoint-initdb.d/00_initial_setup.sql
COPY ./load_data.sql /docker-entrypoint-initdb.d/01_load_data.sql
COPY ./cleanup.sh /docker-entrypoint-initdb.d/99_cleanup.sh

# RUN chmod +x /docker-entrypoint-initdb.d/99_cleanup.sh

EXPOSE 5432

CMD [ "postgres" ]
