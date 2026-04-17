#! /bin/bash
echo "deleting old kubernetes resources if they exist..."
kubectl delete -f config-map.yml   || true
kubectl delete -f secret.yml   || true
kubectl delete -f tls-secret.yml   || true
kubectl delete -f mongodb.yml   || true
kubectl delete -f backend.yml   || true
kubectl delete -f frontend.yml   || true
kubectl delete -f ingress.yml   || true