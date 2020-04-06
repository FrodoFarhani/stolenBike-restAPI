FROM node:13.7.0-alpine as prod_base
ENV NODE_ENV=production
ENV PORT=3000
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --production

FROM prod_base as builder
RUN yarn install
COPY . .
RUN yarn build

FROM prod_base
COPY --from=builder /usr/src/app/dist dist/
EXPOSE $PORT
CMD [ "node", "dist" ]