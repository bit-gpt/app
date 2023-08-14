# Stage 1: Build the application
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Create the final image
FROM caddy:alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /usr/share/caddy/html

WORKDIR /patch
# Add the script to patch window with ENV vars
# https://create-react-app.dev/docs/title-and-meta-tags#injecting-data-from-the-server-into-the-page
COPY entrypoint.sh .
RUN chmod +x /patch/entrypoint.sh

EXPOSE 1420

ENTRYPOINT ["/patch/entrypoint.sh"]
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
