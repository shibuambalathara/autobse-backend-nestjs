FROM node:20.15.0

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npx prisma generate

EXPOSE 3000

CMD [ "npm", "run", "start:dev" ]





