
FROM node:12.18.3-alpine

WORKDIR /usr/app

COPY package*.json .


RUN npm install --quiet

RUN npm install -g nodemon


COPY  ./ ./


CMD ["npm" , "run" , "start"]

