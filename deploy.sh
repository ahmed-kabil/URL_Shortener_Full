#! /bin/bash
echo "Applying Kubernetes manifests..."
kubectl apply -f url-pvc.yml
kubectl apply -f config-map.yml
kubectl apply -f secret.yml
kubectl apply -f tls-secret.yml
kubectl apply -f mongodb.yml
kubectl apply -f backend.yml
kubectl apply -f frontend.yml
kubectl apply -f ingress.yml
echo "Application deployed successfully."
echo "You can access the application at https://url.ahmedkabil.me"