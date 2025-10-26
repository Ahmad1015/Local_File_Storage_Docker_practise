
FROM node:18-alpine

# Install postgresql for pg_isready
RUN apk add --no-cache postgresql

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p uploads

EXPOSE 5000
RUN chmod +x wait-for-db.sh
ENTRYPOINT ["./wait-for-db.sh"]
CMD ["node", "server.js"]
