# Ensure connection and existence of a postgres database

Install: `npm install -g wait-for-pg-db`

This program is able to perform following operations:

1. Waiting for a set of Kafka topics to become available
2. Creating new topics in the case they are not existent

# Configuration

Set following environment variables:

Connection variables as defined by [libpq](https://www.postgresql.org/docs/9.1/static/libpq-envars.html)

## Debug settings

* `DEBUG="showcase:*"` all debug outputs for this program
* `DEBUG="*"` all debug outputs for this program and for `kafka-node`
* `unset DEBUG` no debug outputs

## Retries

* `ABORT_AFTER_TRIES` (optional, default: `10`): After how many checks
  should the program abort?
* `WAIT_BETWEEN_TRIES_S` (optional, default: `5`): How many seconds
  should the program wait before trying again?

## Run SQL scripts

* `RUN_SQL_AFTER_CONNECT`: comma separated list of SQL files that should
  be executed against the database after successfull connection.

# Example calls

## Wait for DB

```sh
export DEBUG="showcase:*"
export PGHOST=localhost
export PGPORT=5432
export PGDATABASE=mydb
wait-for-pg-db
```

## Wait for DB and run script

```sh
export DEBUG="showcase:*"
export PGHOST=localhost
export PGPORT=5432
export PGDATABASE=mydb
export RUN_AFTER_CONNECT=./example.sql
wait-for-pg-db
```
