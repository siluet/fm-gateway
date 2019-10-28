#!/bin/sh

set -e

cmd="$@"

until node ./src/check-rabbitmq-connection.js
do
  >&2 echo "(-) Rabbitmq is unavailable - sleeping..."
  sleep 5
done

>&2 echo "(+) Rabbitmq is up & running - executing commands."

# better to have 1 sec pause before starting app to sure loading & logging finished. 
sleep 1

exec $cmd
