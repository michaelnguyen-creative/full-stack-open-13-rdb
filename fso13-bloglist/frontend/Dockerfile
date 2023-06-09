FROM node:19 AS base
WORKDIR /usr/src/app
COPY ["package*.json", "package*.json", "./"]

FROM base AS test
RUN npm install
COPY . .
ENV CI=true
RUN npm test

FROM base AS build
RUN npm ci --only=production
COPY --from=test /usr/src/app/public ./public
COPY --from=test /usr/src/app/src ./src
ENV BACKEND_URL=http://express-server:3003
RUN npm run build

FROM nginx:1.23.4-alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html
