FROM node:12.13.0-alpine

WORKDIR /node

# Install dependencies
COPY ./package.json /node/
COPY ./yarn.lock /node/
RUN yarn install

COPY ./src /node/src

CMD [ "yarn", "start" ]
