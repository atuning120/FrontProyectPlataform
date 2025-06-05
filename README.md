# FrontProyectPlataform


si se ejecuta el codigo por primera vez:
npm i

para ejecutar el front
npm run dev

para ejecutar el front en la red
npm run dev -- --host


codigo del archivo docker-compose.yml en la raiz del proyecto
version: '3.8'

services:
  frontend:
    build:
      context: ./FrontProyectPlataform
    ports:
      - "5173:5173"
    volumes:
      - ./FrontProyectPlataform:/app
      - /app/node_modules
    environment:
      - CHOKIDAR_USEPOLLING=true
    command: ["npm", "run", "dev", "--", "--host"]
    depends_on:
      - backend

  backend:
    build:
      context: ./BackProyectPlataform
    ports:
      - "5000:5000"
    volumes:
      - ./BackProyectPlataform:/app
      - /app/node_modules
    env_file:
      - ./BackProyectPlataform/.env




para ejecutar el proyecto entero (sin el native de momento)
docker-compose up --build
