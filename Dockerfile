FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm i --save-dev @types/node
RUN npm install -g ts-node

COPY . .

ENV PORT=3400
ENV TOKEN=kewlhrweljbfwehg04rjkfwqedqwec
ENV MONGODB_URL=mongodb://db:27017/pengeluaranku
ENV KEY_USER=mwekndnsfqw3m21ncx2312xnweoq34len21
ENV KEY_JWT_USER=fknelhrfjwfdsfrrwqerdfsfweresfcdxsferstfertfgerfdfwert

EXPOSE 3400

CMD ["npm","start"]
