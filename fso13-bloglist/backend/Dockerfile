# use alpine 3.18 img as base
FROM alpine:3.18
WORKDIR /usr/src/app
# install nodejs v18 & create node user
RUN apk add --no-cache nodejs npm && addgroup -S node && adduser -S node -G node

# copy files and install dependencies
COPY ["package*.json", "package*.json", "./"]
RUN npm ci --only=production
COPY --chown=node:node ./ ./

# set env vars
ENV NODE_ENV=production
USER node
CMD ["npm", "start"]
