FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g @babel/core @babel/cli @babel/preset-env

COPY . .


RUN npm run build-src

CMD [ "npm","start" ]