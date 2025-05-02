# 1. Imagen base con Node y Python
FROM node:18-bullseye-slim

# 2. Instalar dependencias de sistema y check50
RUN apt-get update && \
    apt-get install -y python3 python3-pip clang libcs50-dev && \
    pip3 install check50 cs50 && \
    rm -rf /var/lib/apt/lists/*

# 3. Directorio de trabajo
WORKDIR /usr/src/app

# 4. Copiar package* y correr npm install
COPY package*.json ./
RUN npm install --only=production

# 5. Copiar el resto del código
COPY . .

# 6. Exponer puerto y comando de inicio
EXPOSE 3000
CMD ["node", "index.js"]
