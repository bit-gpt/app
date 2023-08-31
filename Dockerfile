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

# Expose port 8080
EXPOSE 8080

# Add the script to patch window with ENV vars
# https://create-react-app.dev/docs/title-and-meta-tags#injecting-data-from-the-server-into-the-page
COPY entrypoint.sh /prem-entrypoint.sh
RUN chmod +x /prem-entrypoint.sh
ENTRYPOINT ["/prem-entrypoint.sh"]
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
