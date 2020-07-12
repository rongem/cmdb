import express from 'express';
import dotenv from 'dotenv';

import { mongoConnect, getDb } from './util/database';

// import express = require('express');
dotenv.config();
import endpoint from './util/endpoint.config'
const app: express.Application = express();

app.get('/', function (req, res) {
  try {
    const db = getDb();
    db.collection('itemTypes').find().toArray().then(result => console.log(result)).catch(err => console.log(err));
    res.send('Hello World!');
  } catch (ex) {
    console.log(ex);
  }
});

mongoConnect(() => {
  app.listen(3000);
});

// app.listen(3000, function () {
//   console.log('Backend app listening on port 3000!');
// });