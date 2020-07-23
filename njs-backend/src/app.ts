import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import multer, { FileFilterCallback} from 'multer';

import endpoint from './util/endpoint.config';
import { error404 } from './controllers/error.controller';
import attributeGroupRouter from './routes/attribute-group.route';
import attributeGroupsRouter from './routes/attribute-groups.route';
import { preventCORSError } from './controllers/cors.controller';
import { HttpError } from './rest-api/httpError.model';
import {  } from 'fs';

dotenv.config();
const app: express.Application = express();

app.use(preventCORSError);
app.use(bodyParser.json());

const fileStorage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
  if ((file.mimetype === 'application/vnd.ms-excel' && file.originalname.toLowerCase().endsWith('.csv')) ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    file.mimetype === 'text/comma-separated-value' || file.mimetype === 'text/csv')
    {
      callback(null, true);
      return;
    }
    callback(new Error('No excel or csv file'));
}
app.use('/ConvertFileToTable', multer({storage: fileStorage, fileFilter}).single('file'));

app.use('/AttributeGroups', attributeGroupsRouter);
app.use('/AttributeGroup', attributeGroupRouter);

app.use('/', error404);

app.use((error: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
  const status = error instanceof HttpError ? error.httpStatusCode : 500;
  const message = error instanceof HttpError ? error.message : error.toString();
  res.status(status).json({message});
})

mongoose.connect(endpoint.databaseUrl(), { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  app.listen(8000);
}).catch(reason => console.log(reason));
