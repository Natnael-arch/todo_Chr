FROM postgres:14

ENV POSTGRES_DB=postchain \
    POSTGRES_USER=postchain \
    POSTGRES_PASSWORD=postchain \
    POSTGRES_INITDB_ARGS="--locale=C.UTF-8 --encoding=UTF8"

EXPOSE 5432