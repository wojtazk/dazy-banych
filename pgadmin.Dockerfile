FROM elestio/pgadmin:REL-8_13

ENV PGADMIN_DEFAULT_EMAIL=admin@example.com
ENV PGADMIN_DEFAULT_PASSWORD=admin
ENV PGADMIN_LISTEN_PORT=8080

COPY ./servers.json /pgadmin4/servers.json

EXPOSE 8080

CMD ["/usr/local/bin/docker-entrypoint.sh"]
