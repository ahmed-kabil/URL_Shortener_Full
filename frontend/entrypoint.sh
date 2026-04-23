#! /bin/bash
echo "window.backhost = {host: \"https://${BACK_HOST}\", port: \"${BACK_PORT}\"}" > /usr/share/nginx/html/app-config.js
nginx -g "daemon off;"
