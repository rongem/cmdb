import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import endpoint from './util/endpoint.config'
import { error404 } from './controllers/error.controller';
import { router as attributeGroupsRouter } from './routes/attribute-groups.route';

dotenv.config();
const app: express.Application = express();

app.use('/AttributeGroups', attributeGroupsRouter);

app.use('/', error404);

mongoose.connect(endpoint.databaseUrl(), { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  app.listen(3000);
}).catch(reason => console.log(reason));
