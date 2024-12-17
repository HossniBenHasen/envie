#!/bin/bash

sed -Ei "s/(http:\/\/localhost|http:\/\/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/http:\/\/$(hostname -I | awk '{print $1}')/g" .env.development

docker compose -f docker-compose.dev.yml --env-file .env.development up --build --always-recreate-deps --remove-orphans