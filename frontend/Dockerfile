# Utiliser une image Node.js officielle pour construire l'application
FROM node:18 AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires
COPY . /app

# Installer les dépendances et construire l'application
RUN npm install && npm run build

# Utiliser une image Nginx pour servir les fichiers statiques
FROM nginx:alpine

# Copier les fichiers construits dans le dossier Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Exposer le port Nginx
EXPOSE 80

# Commande pour démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]