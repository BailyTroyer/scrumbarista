{{ define "labels" -}}
namespace: {{.Values.meta.namespace}}
environment: {{.Values.meta.environment}}
chart: {{.Chart.Name}}-{{.Chart.Version}}
{{- end }}
