FROM nginx:1.21.6-alpine

COPY ./src/ /usr/share/nginx/html/
