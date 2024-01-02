
FROM node:12.18.3-alpine

WORKDIR /usr/app

COPY package*.json ./

RUN npm install -g nodemon

RUN npm install --quiet

COPY  ./ ./

CMD ["npm" , "start"]

