# Stage 1: Build the application
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Create the final image
FROM caddy:2.4.5-alpine
COPY --from=build /app/dist /usr/share/caddy
COPY caddy/Caddyfile /etc/caddy/Caddyfile
EXPOSE 1420
EXPOSE 8000
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
