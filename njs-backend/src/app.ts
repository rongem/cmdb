import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import multer, { FileFilterCallback} from 'multer';

import endpoint from './util/endpoint.config';
import socket from './controllers/socket.controller';
import { error404 } from './controllers/error.controller';
import attributeGroupRouter from './routes/meta-data/attribute-group.route';
import attributeGroupsRouter from './routes/meta-data/attribute-groups.route';
import attributeTypeRouter from './routes/meta-data/attribute-type.route';
import attributeTypesRouter from './routes/meta-data/attribute-types.route';
import connectionRuleRouter from './routes/meta-data/connection-rule.route';
import connectionRulesRouter from './routes/meta-data/connection-rules.route';
import connectionTypeRouter from './routes/meta-data/connection-type.route';
import connectionTypesRouter from './routes/meta-data/connection-types.route';
import itemTypeAttributeGroupMappingRouter from './routes/meta-data/item-type-attribute-group-mapping.route';
import itemTypeAttributeGroupMappingsRouter from './routes/meta-data/item-type-attribute-group-mappings.route';
import itemTypeRouter from './routes/meta-data/item-type.route';
import itemTypesRouter from './routes/meta-data/item-types.route';
import metaDataRouter from './routes/meta-data/meta-data.route';
import userRouter from './routes/meta-data/user.route';
import usersRouter from './routes/meta-data/users.route';
import configurationItemRouter from './routes/item-data/configuration-item.route';
import configurationItemsRouter from './routes/item-data/configuration-items.route';
import connectionRouter from './routes/item-data/connection.route';
import connectionsRouter from './routes/item-data/connections.route';
import itemAttributeRouter from './routes/item-data/item-attribute.route';
import itemAttributesRouter from './routes/item-data/item-attributes.route';
import itemLinkRouter from './routes/item-data/item-link.route';
import importRouter from './routes/item-data/import.route';
import proposalsRouter from './routes/item-data/proposals.route';
import { preventCORSError } from './controllers/cors.controller';
import { HttpError } from './rest-api/httpError.model';
import {  } from 'fs';

dotenv.config();
const app: express.Application = express();

app.use(preventCORSError);
app.use(bodyParser.json());

const fileStorage = multer.memoryStorage();

// File import handler
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

// MetaData
app.use('/AttributeGroups', attributeGroupsRouter);
app.use('/AttributeGroup', attributeGroupRouter);
app.use('/AttributeTypes', attributeTypesRouter);
app.use('/AttributeType', attributeTypeRouter);
app.use('/ConnectionTypes', connectionTypesRouter);
app.use('/ConnectionType', connectionTypeRouter);
app.use('/ItemTypes', itemTypesRouter);
app.use('/ItemType', itemTypeRouter);
app.use('/ConnectionRules', connectionRulesRouter);
app.use('/ConnectionRule', connectionRuleRouter);
app.use('/ItemTypeAttributeGroupMappings', itemTypeAttributeGroupMappingsRouter);
app.use('/ItemTypeAttributeGroupMapping', itemTypeAttributeGroupMappingRouter);
app.use('/MetaData', metaDataRouter);
app.use('/Users', usersRouter);
app.use('/User', userRouter);

// Data
app.use('/ConfigurationItems', configurationItemsRouter);
app.use('/ConfigurationItem', configurationItemRouter);
app.use('/Connections', connectionsRouter);
app.use('/Connection', connectionRouter);
app.use('/ItemAttributes', itemAttributesRouter);
app.use('/ItemAttribute', itemAttributeRouter);
app.use('/ItemLink', itemLinkRouter);

// Special routes
app.use('/Proposals', proposalsRouter);
app.use('/', importRouter);

app.use('/', error404);

app.use((error: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
  const status = error instanceof HttpError ? error.httpStatusCode : 500;
  const message = error instanceof HttpError ? error.message : error.toString();
  res.status(status).json({message});
})

mongoose.connect(endpoint.databaseUrl(), { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  const server = app.listen(8000);
  const io = socket.init(server);
  io.on('connection', socket => {
    console.log('Client connected');
  });
}).catch(reason => console.log(reason));
