FROM node:17-alpine3.12

WORKDIR /app

COPY ./.env.production /app/

# Install dependencies
COPY ./package*.json /app
RUN npm i

COPY ./pages /app/pages
COPY ./public /app/public
COPY ./tsconfig* /app/
COPY ./next* /app/

RUN npm run build
CMD [ "npm", "run", "start" ]
