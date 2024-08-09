FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --prod

COPY . .

EXPOSE 3000
CMD ["npm", "start"]
