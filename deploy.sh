#!/bin/bash
echo "Deploying the application..."
# Build and push backend image
rm backend/.env 2>/dev/null || true
docker build -t url-shortener-backend:latest backend/
echo "Backend image built successfully."
docker build -t url-shortener-frontend:latest frontend/
echo "Frontend image built successfully."
echo "copy the images to the cluster"
docker save url-shortener-backend:latest > url-shortener-backend.tar
docker save url-shortener-frontend:latest > url-shortener-frontend.tar
scp url-shortener-backend.tar kube@192.168.0.179:/tmp
scp url-shortener-frontend.tar kube@192.168.0.179:/tmp
ssh -t kube@192.168.0.179 "sudo ctr -n k8s.io images import /tmp/url-shortener-backend.tar"
ssh -t kube@192.168.0.179 "sudo ctr -n k8s.io images import /tmp/url-shortener-frontend.tar"
# sudo ctr -n k8s.io images import url-shortener-backend.tar
# sudo ctr -n k8s.io images import url-shortener-frontend.tar
echo "Images loaded into the cluster successfully."
echo "deleting old kubernetes resources if they exist..."
kubectl delete -f config-map.yml   || true
kubectl delete -f secret.yml   || true
kubectl delete -f tls-secret.yml   || true
kubectl delete -f mongodb.yml   || true
kubectl delete -f backend.yml   || true
kubectl delete -f frontend.yml   || true
kubectl delete -f ingress.yml   || true
echo "Applying Kubernetes manifests..."
kubectl apply -f config-map.yml
kubectl apply -f secret.yml
kubectl apply -f tls-secret.yml
kubectl apply -f mongodb.yml
kubectl apply -f backend.yml
kubectl apply -f frontend.yml
kubectl apply -f ingress.yml
echo "Application deployed successfully."
echo "You can access the application at https://url.ahmedkabil.me"