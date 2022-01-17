FROM node:lts

WORKDIR /app

# Install dependencies
COPY ./package*.json /app/
RUN npm i

COPY ./src /app/src/
COPY ./tsconfig* /app/

RUN npm run build
CMD [ "npm", "run", "start:prod" ]
