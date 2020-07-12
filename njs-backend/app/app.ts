import express = require('express');

require('dotenv').config();

console.log(process.env.MONGODB_URI);
const mongoConnect = require('./util/database').mongoConnect;


const app: express.Application = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

mongoConnect(() => {
  app.listen(3000);
});

// app.listen(3000, function () {
//   console.log('Backend app listening on port 3000!');
// });