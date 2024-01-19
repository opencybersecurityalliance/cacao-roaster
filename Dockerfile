FROM node:21.6-bullseye

RUN mkdir -p /cacao-roaster

WORKDIR /cacao-roaster

COPY package.json package-lock.json .

RUN npm install

COPY . . 

RUN chown -Rh node:node /cacao-roaster

USER node

EXPOSE 3000

CMD [ "npm", "start"]