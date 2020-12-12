import { Application } from 'express';
const express = require('express');
const next = require('next');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schemas/schema').default;
const mongoose = require('mongoose');

require('dotenv').config();

const PORT: number = Number(process.env.PORT) || 3000;
const dev: boolean = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  try {
    const server: Application = express();

    mongoose.connect(
      `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASS}@cluster0.djmgu.mongodb.net/gql?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true },
    );

    server.use(cors());
    server.use('/graphql', graphqlHTTP({ schema, graphiql: true }));

    const dbConnection = mongoose.connection;

    dbConnection.on("error", (e : string) => console.log(`>>> Connection Error: ${e}`));
    dbConnection.once("open", () => console.log(">>> Connected to MONGO DB!"));


    server.get('/posts', (req, res) => {
      return app.render(req, res, '/posts', req.query);
    });

    server.get('/b', (req, res) => {
      return app.render(req, res, '/b', req.query);
    });

    server.all('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(PORT, (): void => {
      console.log(`>>> Server started on http://localhost:${PORT}`);
    });
  } catch (err) {
    throw err;
  }
});
