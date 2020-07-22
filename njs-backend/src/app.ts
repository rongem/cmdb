import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import multer from 'multer';

import endpoint from './util/endpoint.config';
import { error404 } from './controllers/error.controller';
import attributeGroupRouter from './routes/attribute-group.route';
import attributeGroupsRouter from './routes/attribute-groups.route';
import { preventCORSError } from './controllers/cors.controller';
import { HttpError } from './rest-api/httpError.model';

dotenv.config();
const app: express.Application = express();

app.use(preventCORSError);
app.use(bodyParser.json());
app.use(multer().single('file'));

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
