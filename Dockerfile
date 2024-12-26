FROM node:20

WORKDIR /app/backend

COPY package*.json ./

RUN npm install

COPY . . 

EXPOSE 3001

ENV DATABASE_URL = postgres://postgres:moaaz@postgres:5432/template1

CMD ["node","index.js"]


