FROM node:lts

WORKDIR /modi

COPY package.json ./

# 시간 설정 (서울)
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone


RUN npm i 
RUN npm i -g pm2

COPY . .

EXPOSE 5001

# CMD ["npm","start"]
CMD ["pm2-runtime","start","./server.js"]