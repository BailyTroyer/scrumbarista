FROM node:17-alpine3.12

WORKDIR /app

# Install dependencies
COPY ./package*.json /app
RUN npm i

COPY ./pages /app/pages
COPY ./components /app/components
COPY ./public /app/public
COPY ./tsconfig* /app/
COPY ./next* /app/

RUN npm run build
CMD [ "npm", "run", "start" ]
