# specify a base image for compiling
FROM node:alpine
WORKDIR /usr/app

# install dependencies
COPY package*.json ./
RUN npm update -g
RUN npm install
COPY . .
RUN npm run comp

# specify base image
FROM node:alpine
WORKDIR /usr/app

# install dependencies
COPY package*.json ./
COPY --from=0 /usr/app/dist ./dist
RUN npm update -g
RUN npm ci --only-production

# port
EXPOSE 8000
# default command
CMD ["npm", "start"]
