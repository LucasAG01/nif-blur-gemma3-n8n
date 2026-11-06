# Imagen de n8n que incluye sharp para el nodo de nitidez.
# Se fija la versión 1.93.0 porque a partir de la 1.94.0 sharp falla en Docker.
FROM n8nio/n8n:1.93.0

USER root
RUN npm install -g sharp
USER node
