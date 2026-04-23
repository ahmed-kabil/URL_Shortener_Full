FROM nginx:latest
WORKDIR /usr/share/nginx/html/
COPY . .
RUN mv entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]