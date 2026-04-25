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
# scp url-shortener-backend.tar kube@192.168.0.179:/tmp
# scp url-shortener-frontend.tar kube@192.168.0.179:/tmp
# ssh -t kube@192.168.0.179 "sudo ctr -n k8s.io images import /tmp/url-shortener-backend.tar"
# ssh -t kube@192.168.0.179 "sudo ctr -n k8s.io images import /tmp/url-shortener-frontend.tar"
sudo ctr -n k8s.io images import url-shortener-backend.tar
sudo ctr -n k8s.io images import url-shortener-frontend.tar
echo "Images loaded into the cluster successfully."
echo "deleting old kubernetes resources if they exist..."

kubectl delete -f k8s/config-map.yml   || true
kubectl delete -f k8s/secret.yml   || true
kubectl delete -f k8s/tls-secret.yml   || true
kubectl delete -f k8s/mongodb.yml   || true
kubectl delete -f k8s/backend.yml   || true
kubectl delete -f k8s/frontend.yml   || true
kubectl delete -f k8s/ingress.yml   || true
echo "Applying Kubernetes manifests..."
#kubectl apply -f url-pvc.yml
kubectl create namespace url-short
kubectl apply -f k8s/config-map.yml
kubectl apply -f k8s/secret.yml
kubectl apply -f k8s/tls-secret.yml
kubectl apply -f k8s/mongodb.yml
kubectl rollout status statefulset -n url-short url-mongodb-sfs  --timeout 90s
# kubectl exec -it url-mongodb-sfs-0 -n url-short -- mongosh --eval 'rs.initiate({_id: "rs0", members: [{_id: 0, host: "url-mongodb-sfs-0.url-mongodb-headless-srv:27017", priority: 2}, {_id: 1, host: "url-mongodb-sfs-1.url-mongodb-headless-srv:27017"}, {_id: 2, host: "url-mongodb-sfs-2.url-mongodb-headless-srv:27017"}]})'
kubectl apply -f k8s/mongo-rs-init.yml
kubectl apply -f k8s/backend.yml
kubectl rollout status deployment -n url-short url-backend-dep --timeout 60s
kubectl apply -f k8s/frontend.yml
kubectl rollout status deployment -n url-short url-frontend-dep --timeout 60s
kubectl apply -f k8s/ingress.yml

echo "Application deployed successfully."
echo "You can access the application at https://url.ahmedkabil.me"