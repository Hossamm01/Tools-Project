# Stage 1: Build frontend
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN chmod -R 777 /app
RUN npm run build

# Stage 2: Serve frontend
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN mkdir -p /var/cache/nginx/client_temp \
    && chmod -R 777 /var/cache/nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
