# specify a base image
FROM node:alpine
WORKDIR /usr/app

# install dependencies
COPY ./dist/ ./
RUN npm install

# default command
CMD ["node", "app.js"]
