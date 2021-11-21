#!/bin/bash

docker build --platform linux/amd64 -t api .
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 418118555604.dkr.ecr.us-east-1.amazonaws.com
helm upgrade --install api ./helm --namespace scrumbarista --set containers.api.image.tag=latest --wait