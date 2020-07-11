import express = require('express');

import dotenv = require('dotenv');
dotenv.config();
console.log(process.env.MONGODB_URI);

const app: express.Application = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Backend app listening on port 3000!');
});