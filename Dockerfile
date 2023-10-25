FROM node:20-alpine as build

WORKDIR /app

COPY package.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM node:20-alpine as run

WORKDIR /app
COPY --from=build /app .

ENV HOST=0.0.0.0
EXPOSE 3000
CMD ["npm", "run", "start"]