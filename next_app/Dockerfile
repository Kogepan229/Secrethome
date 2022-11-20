FROM node

WORKDIR /next_app
#COPY ./ ./
COPY ./package.json ./package-lock.json ./
RUN apt-get -y update && apt-get -y install ffmpeg && npm i

RUN npm run build

#RUN npm i
#ENTRYPOINT ["npm", "install"]