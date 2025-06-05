# frontend/Dockerfile
FROM node:20

# Establece el directorio de trabajo
WORKDIR /app

# Copia el package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Expone el puerto de desarrollo de Vite
EXPOSE 5173

# Comando por defecto
CMD ["npm", "run", "dev"]
