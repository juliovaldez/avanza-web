# Etapa 2: Desarrollo con SSH
FROM node:20 AS dev

# Crea y establece el directorio de trabajo
WORKDIR /app

# Copia las dependencias instaladas desde la etapa de construcción
COPY . .

# Instala las dependencias de la aplicación
RUN npm install -g @angular/cli@19.0.0
RUN npm install

# Exponer el puerto de la aplicación Angular (por defecto es 4200)
EXPOSE 4200

# Comando de inicio que ejecuta SSH y ng serve usando un shell
CMD ["sh", "-c", "ng serve --host 0.0.0.0"]
#CMD  ng serve --host 0.0.0.0



# Etapa 1: Construcción
FROM node:20 AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia el resto de los archivos de la aplicación
COPY . .

# Instala las dependencias de la aplicación
RUN npm install -g @angular/cli
RUN npm install

# ARG que se puede pasar desde el build o inyectar desde variable
ARG NG_BUILD_CONFIG
ENV NG_BUILD_CONFIG=${NG_BUILD_CONFIG:-production}

RUN echo "📢 Angular Build config: $NG_BUILD_CONFIG"
# Build dinámico según configuración
RUN ng build --configuration $NG_BUILD_CONFIG --base-href /



# Etapa 3: Producción
FROM nginx:alpine AS prod

# Copia la configuración de Nginx
COPY ./conf/nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos de la aplicación construidos desde la etapa de construcción
COPY --from=build /app/dist/admin_web/browser /usr/share/nginx/html

# Exponer el puerto 80 para producción
EXPOSE 80

# Ejecutar Nginx en el modo predeterminado
CMD ["nginx", "-g", "daemon off;"]