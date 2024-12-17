FROM postgres:17.2-bookworm

ENV POSTGRES_USER="admin"
ENV POSTGRES_PASSWORD="admin"
ENV POSTGRES_DB="nasza_oswiata"

EXPOSE 5432

CMD [ "postgres" ]
