FROM node:19-alpine AS base
WORKDIR /usr/src/app
COPY ["package*.json", "package*.json", "./"]

FROM base as start
RUN npm ci --only=production
COPY --chown=node:node . .
ENV NODE_ENV=production

USER node
CMD ["npm", "start"]
