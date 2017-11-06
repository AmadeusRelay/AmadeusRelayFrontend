FROM node:latest
WORKDIR src
COPY package.json /src
RUN npm install
COPY . /src
EXPOSE 8080
ENTRYPOINT npm run start:cloud
