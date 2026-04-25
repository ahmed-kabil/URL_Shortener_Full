#! /bin/bash
echo "deleting old kubernetes resources if they exist..."
kubectl delete -f k8s/config-map.yml   || true
kubectl delete -f k8s/secret.yml   || true
kubectl delete -f k8s/tls-secret.yml   || true
kubectl delete -f k8s/mongodb.yml   || true
kubectl delete -f k8s/mongo-rs-init.yml
kubectl delete -f k8s/backend.yml   || true
kubectl delete -f k8s/frontend.yml   || true
kubectl delete -f k8s/ingress.yml   || true