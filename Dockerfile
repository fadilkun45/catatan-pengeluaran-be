FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

ENV PORT=3400
ENV TOKEN=kewlhrweljbfwehg04rjkfwqedqwec
ENV MONGODB_URL=mongodb://localhost:27017/pengeluaranku
ENV KEY_USER=mwekndnsfqw3m21ncx2312xnweoq34len21
ENV KEY_JWT_USER=fknelhrfjwfdsfrrwqerdfsfweresfcdxsferstfertfgerfdfwert

EXPOSE 3400

CMD ["npm","start"]