import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import endpoint from './util/endpoint.config';
import { error404 } from './controllers/error.controller';
import { router as attributeGroupsRouter } from './routes/attribute-groups.route';
import { preventCORSError } from './controllers/cors.controller';

dotenv.config();
const app: express.Application = express();

app.use(bodyParser.json());
app.use(preventCORSError);

app.use('/AttributeGroups', attributeGroupsRouter);

app.use('/', error404);

app.use((error: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
})

mongoose.connect(endpoint.databaseUrl(), { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  app.listen(3000);
}).catch(reason => console.log(reason));
