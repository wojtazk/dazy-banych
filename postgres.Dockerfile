FROM postgres:17.2-bookworm

ENV POSTGRES_USER="postgres"
ENV POSTGRES_PASSWORD="postgres"
ENV POSTGRES_DB="nasza_oswiata"

EXPOSE 5432

CMD [ "postgres" ]