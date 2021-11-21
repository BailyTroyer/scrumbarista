#!/bin/bash

k create secret generic app.config -n scrumbarista --from-env-file=.env.production
docker build --platform linux/amd64 -t app .
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 418118555604.dkr.ecr.us-east-1.amazonaws.com
helm upgrade --install app ./helm --namespace scrumbarista --set containers.app.image.tag=latest --wait