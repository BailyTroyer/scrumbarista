FROM node:17-alpine3.12

WORKDIR /app

COPY ./.env.production /app/

# Install dependencies
COPY ./package*.json /app

RUN npm i

COPY ./.eslintrc.js /app/.eslintrc.js
COPY ./src /app/src
COPY ./types /app/types
COPY ./public /app/public
COPY ./tsconfig.json /app/tsconfig.json
COPY ./next* /app/

RUN npm run build
CMD [ "npm", "run", "start" ]
