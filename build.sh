#!/bin/bash
# TODO: view for login
docker build -f Dockerfile.prod --target backend -t docker.uha4point0.fr:5000/envie-prod-backend:latest .
docker build -f Dockerfile.prod --target frontend -t docker.uha4point0.fr:5000/envie-prod-frontend:latest .
docker push docker.uha4point0.fr:5000/envie-prod-backend:latest
docker push docker.uha4point0.fr:5000/envie-prod-frontend:latest

