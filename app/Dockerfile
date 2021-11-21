FROM node:17-alpine3.12

WORKDIR /app

COPY ./.env.production /app/

# Install dependencies
COPY ./package.json /app/
COPY ./yarn.lock /app/
RUN yarn install

COPY ./pages /app/pages
COPY ./public /app/public
COPY ./tsconfig* /app/
COPY ./next* /app/

RUN yarn build

EXPOSE 3000
CMD [ "yarn", "start" ]
