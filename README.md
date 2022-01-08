# Scrumbarista

A free alternative for managing your asynchronous standups. In this case here's a free lunch :D

[![API codecov](https://codecov.io/gh/BailyTroyer/scrumbarista/branch/main/graph/badge.svg?token=VWKMJJDQHL&flag=api)](https://codecov.io/gh/BailyTroyer/scrumbarista)
[![Bolt codecov](https://codecov.io/gh/BailyTroyer/scrumbarista/branch/main/graph/badge.svg?token=VWKMJJDQHL&flag=bolt)](https://codecov.io/gh/BailyTroyer/scrumbarista)


## Running Locally

@todo create global makefile + docker steps

```bash
$ cp docker-compose.yaml docker-compose.override.yaml
...
// Change instances of REPLACE_ME with your content
...
$ docker-compose build // builds images
$ docker-compose up -d
```

You can find the API running by default on `8000`, the bolt API on `8080` and the webapp on `3000`. However, they are all configurable by passing the `PORT` environment variable.

## Project Overview

How and why this is structured this way?

## Running in Kubernetes (Istio)

### Build Docker Images

```bash
$ docker-compose build --pull
$ docker-compose push
```

### Install (Upgrade) Helm Chart

```bash
$ helm upgrade --install scrumbarista ./deploy --namespace scrumbarista --wait --atomic
```

## Running Locally

All commands can be run locally without docker using node, however its highly recommended to use the node version defined in the Docker
images. If you're using nvm you can simply run `nvm use` to load the nvm version specified in the .nvmrc`.

### Build & Run

```bash
$ docker-compose build
$ docker-compose up -d
```

### Run ngrok

```bash
$ ngrok http 3000 -region us
```

### Run tests (API)

```bash
$ docker-compose run api npm run test:cov
```

## Architecture

@todo graphviz diagram

WEB -> NextAuth -> Slack

Web -> API -> Slack

API -> MySQL

Slack -> Bolt -> MySQL

![Alt text](https://g.gravizo.com/svg?
  digraph G {
    size ="4,4";
    main [shape=box];
    main -> parse [weight=8];
    parse -> execute;
    main -> init [style=dotted];
    main -> cleanup;
    execute -> { make_string; printf}
    init -> make_string;
    edge [color=red];
    main -> printf [style=bold,label="100 times"];
    make_string [label="make a string"];
    node [shape=box,style=filled,color=".7 .3 1.0"];
    execute -> compare;
  }
)

## Deployment

@todo talk about helm, istio, and how its all setup & where to view dashboards (exposed w/ auth)

## Contributing

@todo `CONTRIBUTING.md` doc
