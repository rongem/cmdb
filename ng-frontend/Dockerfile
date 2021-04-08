FROM node:alpine
WORKDIR /usr/app

COPY package*.json ./
#RUN npm update -g # only if image was too old
RUN npm install
COPY . .
RUN npm run build:prod backend-access
RUN npm run build:prod cmdb
RUN npm run build:prod dcman
