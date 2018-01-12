FROM node:latest
WORKDIR src
COPY package.json /src
COPY . /src
RUN npm install
EXPOSE 8080
ENTRYPOINT npm run start:cloud
