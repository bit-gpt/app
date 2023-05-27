FROM node:19-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 1420

CMD npm run dev -- --host