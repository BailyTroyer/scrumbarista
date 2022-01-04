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

## Filestructure / Monorepo

@todo finish this

```
├── .github         // Github configs
├── api             // API
│   ├── components  // Shared (Atomic) UI elements
│   └── pages       // Routable site pages
├── app             // Main webapp
├── marketing       // API
└── Package.json    // Dependencies & Scripts
```

## Architecture

@todo graphviz diagram

## Deployment

@todo talk about helm, istio, and how its all setup & where to view dashboards (exposed w/ auth)

## Contributing

@todo `CONTRIBUTING.md` doc
