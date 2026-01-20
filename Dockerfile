# Usa una imagen base de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de tu aplicación al contenedor
COPY package.json package-lock.json ./ 

# Instala las dependencias
RUN npm install --production

# Copia el resto de los archivos
COPY . .

# Expone el puerto en el que corre la app (ajústalo si usas otro)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
