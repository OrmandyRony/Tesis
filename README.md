# En la carpeta server/
docker build -t mi-usac-server:latest .

# Levántalo
docker run --rm -p 3000:3000 mi-usac-server:latest
