#FROM node:8.1
#FROM node:latest
FROM node
LABEL maintainer="Frodofarhani@gmail.com"

# These woudl be our enviroment variables that node can read them
ENV NODE_ENV=production
ENV PORT=3000

RUN mkdir -p /app
# set the context for commands we wanna run, where we can run it from!
WORKDIR /app
ADD package*.json ./
# you can copy individual file or even folder
# . means the whole folder we are in it after . we tell where to copy it in docker image
COPY . .
# this will mount this particiular volume in the container into th folder on host system
# this is -v in binfing source code
#VOLUME ["/var/www"]
RUN yarn install
# read from ENV port
EXPOSE $PORT
ENTRYPOINT ["npm","start"]