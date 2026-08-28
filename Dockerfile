FROM nginx:alpine

# Copia os arquivos estáticos do site para o diretório servido pelo nginx
COPY index.html /usr/share/nginx/html/
COPY alleenergia.png /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
