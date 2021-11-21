FROM node:17-alpine3.12

WORKDIR /app

# Install dependencies
COPY ./package.json /app/
COPY ./yarn.lock /app/
RUN yarn install

COPY ./pages /app/pages
COPY ./components /app/components
COPY ./public /app/public
COPY ./tsconfig* /app/
COPY ./next* /app/

RUN yarn build

CMD [ "yarn", "start" ]
