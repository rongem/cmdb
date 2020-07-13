import express from 'express';
import dotenv from 'dotenv';

import { mongoConnect } from './util/database';
import { error404 } from './controllers/error.controller';
import { router as attributeGroupsRouter } from './routes/attribute-groups.route';

dotenv.config();
const app: express.Application = express();

app.use('/AttributeGroups', attributeGroupsRouter);

app.use('/', error404);

mongoConnect(() => {
  app.listen(3000);
});

// app.listen(3000, function () {
//   console.log('Backend app listening on port 3000!');
// });