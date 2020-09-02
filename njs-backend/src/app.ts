import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import multer, { FileFilterCallback} from 'multer';
import ntlm from 'express-ntlm';

import endpoint from './util/endpoint.config';
import socket from './controllers/socket.controller';
import restRouter from './routes/rest.route';
import { error404 } from './controllers/error.controller';
import { getAuthentication } from './controllers/auth/authentication.controller';
import { preventCORSError } from './controllers/cors.controller';
import { HttpError } from './rest-api/httpError.model';

dotenv.config();
const app: express.Application = express();
// mongoose.set('debug', true);

app.use(preventCORSError);
app.use(ntlm({
  debug: function() {
    // const args = Array.prototype.slice.apply(arguments);
    // console.log(args);
  },
  // domain: '',
  // domaincontroller: 'ldap://',
}));
app.use(getAuthentication)
app.use(bodyParser.json());

const fileStorage = multer.memoryStorage();

// File import handler
const fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
  if ((file.mimetype === 'application/vnd.ms-excel' && file.originalname.toLowerCase().endsWith('.csv')) ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    file.mimetype === 'text/comma-separated-value' || file.mimetype === 'text/csv') {
      callback(null, true);
      return;
    }
    callback(new Error('No excel or csv file'));
}
app.use('/rest/ConvertFileToTable', multer({storage: fileStorage, fileFilter}).single('file'));

app.use('/rest', restRouter);

app.use('/', error404);

app.use((error: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
  const status = error instanceof HttpError ? error.httpStatusCode : 500;
  const message = error instanceof HttpError ? error.message : error.toString();
  const data = error instanceof HttpError && error.data ? error.data : undefined;
  res.status(status).json({message, data});
});

mongoose.connect(endpoint.databaseUrl(), { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(() => {
  const server = app.listen(8000);
  const io = socket.init(server);
  io.on('connection', socket => {
    console.log('Client connected');
  });
}).catch(reason => console.log(reason));
