FROM node:lts

WORKDIR /app

# Install dependencies
COPY ./package.json /app
COPY ./yarn.lock /app

RUN yarn install

COPY ./src /app/src
COPY ./tsconfig* /app

RUN yarn build

CMD [ "yarn", "start:prod" ]
