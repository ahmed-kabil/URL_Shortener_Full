#! /bin/bash
echo "Applying Kubernetes manifests..."

kubectl apply -f k8s/config-map.yml
kubectl apply -f k8s/secret.yml
kubectl apply -f k8s/tls-secret.yml
kubectl apply -f k8s/mongodb.yml
kubectl rollout status statefulset url-mongodb-sfs  --timeout 90s
kubectl apply -f k8s/backend.yml
kubectl rollout status deployment url-backend-dep --timeout 60s
kubectl apply -f k8s/frontend.yml
kubectl rollout status deployment url-frontend-dep --timeout 60s
kubectl apply -f k8s/ingress.yml
kubectl exec -it url-mongodb-sfs-0 -- mongosh --eval 'rs.initiate({_id: "rs0", members: [{_id: 0, host: "url-mongodb-sfs-0.url-mongodb-headless-srv:27017", priority: 2}, {_id: 1, host: "url-mongodb-sfs-1.url-mongodb-headless-srv:27017"}, {_id: 2, host: "url-mongodb-sfs-2.url-mongodb-headless-srv:27017"}]})'
echo "Application deployed successfully."
echo "You can access the application at https://url.ahmedkabil.me"