FROM node:8-alpine

COPY package.json ./

RUN yarn install

COPY index.js .

EXPOSE 4242

CMD node index.js
