import express from 'express';
import dotenv from 'dotenv';

import { mongoConnect, getDb } from './util/database';
import { error404 } from './controllers/error.controller';

dotenv.config();
const app: express.Application = express();

app.get('/x', function (req, res) {
  try {
    const db = getDb();
    db.collection('itemTypes').find().toArray().then(result => console.log(result)).catch(err => console.log(err));
    res.send('Hello World!');
  } catch (ex) {
    console.log(ex);
  }
});

app.use('/', error404);

mongoConnect(() => {
  app.listen(3000);
});

// app.listen(3000, function () {
//   console.log('Backend app listening on port 3000!');
// });