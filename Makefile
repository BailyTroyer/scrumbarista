# ACV Infra Permissions Makefile

# ============================================================================
# Globals
# ============================================================================

DOCKER_IMAGE:=294290347293.dkr.ecr.us-east-1.amazonaws.com/scrumbarista
CONTAINER_IMAGE:=scrumbarista
VERSION:=$(shell git log -1 --pretty=format:"%H")
.DEFAULT_GOAL:=build

# ============================================================================
# Local Development Commands
# ============================================================================

.PHONY: aws-login
aws-login:
	@eval $(shell aws ecr get-login --no-include-email --region us-east-1)

.PHONY: pull-cache
pull-cache: aws-login
	$(eval RECENT_TAG := $(shell aws ecr describe-images --repository-name $(CONTAINER_IMAGE) --query 'reverse(sort_by(imageDetails, &imagePushedAt))[:1].imageTags[:1]' | tr -d ' []"\t\n\r\f' || true))
	$(eval CACHE_URL := $(DOCKER_IMAGE):$(RECENT_TAG))
	docker pull $(CACHE_URL) || true
	$(eval CACHE_FROM := --cache-from $(CACHE_URL))

.PHONY: build
build:
	docker build $(CACHE_FROM) -t $(CONTAINER_IMAGE) .

.PHONY: lint
lint:
	docker run \
		-v $(shell pwd)/src:/node/src \
		-v $(shell pwd)/public:/node/public \
		$(CONTAINER_IMAGE) yarn lint

.PHONY: run
run:
	docker-compose up

.PHONY: docker-push
docker-push: aws-login
	docker tag $(CONTAINER_IMAGE) $(DOCKER_IMAGE):$(VERSION)
	docker push $(DOCKER_IMAGE):$(VERSION)

.PHONY: clean
clean:
	rm -rf ./node_modules ./public
