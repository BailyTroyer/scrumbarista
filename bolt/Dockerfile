FROM node:17-alpine3.12

WORKDIR /app

# Install dependencies
COPY ./package*.json /app/
RUN npm i

COPY ./src /app/src/
COPY ./tsconfig* /app/

CMD [ "npm", "run", "start:prod" ]
