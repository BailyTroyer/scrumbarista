# Scrumbarista Helm Chart

## TL;DR;

```console
$ helm upgrade --install scrumbarista ./ --namespace scrumbarista --atomic
```

## Introduction

This chart bootstraps a Scrumbarista API,WebUI and Bolt service on a [Kubernetes](http://kubernetes.io) cluster using the [Helm](https://helm.sh) package manager.

## Prerequisites

- Kubernetes 1.3+ with Beta APIs enabled
- Istio 1.1+ with sidecar injection enabled in your namespace
    ```bash
    $ kubectl label namespace {name} istio-injection=enabled
    ```

## Installing the Chart

To install the chart with the release name `my-release`:

```console
kubectl create secret generic app.config -n {namespace} --from-env-file=.env
helm install --name my-release ./path/to/chart
```

The command deploys the API,Web,Bolt services on the Kubernetes cluster in the default configuration. The [configuration](#configuration) section lists the parameters that can be configured during installation.

> **Tip**: List all releases using `helm list --all-namespaces`

## Uninstalling the Chart

To uninstall/delete the `my-release` deployment:

```console
helm delelete my-release
```

The command removes all the Kubernetes components associated with the chart and deletes the release.

## Configuration

The following table lists the configurable parameters of the API,Web,Bolt deployments in the chart and their default values.

**Meta**:

Parameter | Description | Default
--------- | ----------- | -------
`meta.provider` | cloud provider the cluster is running on | `aws`
`meta.region` | kubernetes cluster region | `us-east-1`
`meta.clusterName` | kubernetes cluster name | `useast1.dev.baily.io`
`meta.name` | main application name | `scrumbarista`
`meta.namespace` | deployed namespace | `scrumbarista`
`meta.environment` | deployed namespace | `production`


**API/Bolt/App**:

Each API/Bolt/App config is identical except for varying image URLs, resources, environment variables and ports. All you really need to change on deployment is the `containers.{api;bolt;app}.image.tag` on CI/CD to validate new code releases are properly tagged and added to your deployment.

Parameter | Description | Default
--------- | ----------- | -------
`containers.{api;bolt;app}.name` | main container name | `api,bolt,app`
`containers.{api;bolt;app}.image.repository` | main container image repo | `REPO_HERE`
`containers.{api;bolt;app}.image.tag` | main container image tag | `CHANGE_ME`
`containers.{api;bolt;app}.port` | main pod's port | `8000,8080,3000`
`containers.{api;bolt;app}.replicas` | number of main pod replicas | `1`
`containers.{api;bolt;app}.resources` | main pod resource requests & limits | `{}`
