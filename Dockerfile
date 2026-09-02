FROM nginx:alpine

COPY index.html styles.css config.js app.js alleenergia-logo.png logo-alle-pequena.webp /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
