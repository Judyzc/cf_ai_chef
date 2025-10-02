FROM node:20

WORKDIR /app

RUN npm install -g wrangler

COPY . .

RUN npm install 

EXPOSE 8787

CMD ["sh", "-c", "wrangler dev --persist-to .wrangler/state --ip 0.0.0.0 --port 8787"]
