import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import ntlm from 'express-ntlm';
import { body } from 'express-validator';
import swaggerUI from 'swagger-ui-express';

import endpoint from './util/endpoint.config';
import socket from './controllers/socket.controller';
import restRouter from './routes/rest.route';
import { error404 } from './controllers/error.controller';
import { getAuthentication, issueToken } from './controllers/auth/authentication.controller';
import { preventCORSError } from './controllers/cors.controller';
import { HttpError } from './rest-api/httpError.model';
import { invalidAuthenticationMethod, invalidPassphraseMsg, invalidUserNameMsg } from './util/messages.constants';
import { stringExistsBodyValidator, validate } from './routes/validators';
import { accountNameField, passphraseField } from './util/fields.constants';
import * as openApiDocumentation from './openApiDocumentation.json';
import { HouseKeeping } from './models/abstraction-layer/housekeeping';

const app: express.Application = express();
// mongoose.set('debug', true);

app.use(preventCORSError);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(openApiDocumentation));

app.use('/login', express.json());
app.get('/login', (req, res, next) => res.json(endpoint.authMode()));

switch (endpoint.authMode()) {
  case 'ntlm':
    app.use(ntlm({
      // debug: function() {
        // const args = Array.prototype.slice.apply(arguments);
        // console.log(args);
      // },
      // domain: '',
      // domaincontroller: 'ldap://',
    }));
    break;
  case 'jwt':
    const userNameBodyValidator = stringExistsBodyValidator(accountNameField, invalidUserNameMsg).toLowerCase();
    const userPassphraseBodyValidator = body(passphraseField, invalidPassphraseMsg).trim().isStrongPassword();
    app.post('/login', [userNameBodyValidator, userPassphraseBodyValidator], validate, issueToken);
    break;
  default:
    throw new Error(invalidAuthenticationMethod);
}

app.use('/rest', express.json(), getAuthentication, restRouter);

app.use('/', error404);

app.use((error: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
  const status = error instanceof HttpError ? error.httpStatusCode : 500;
  const message = error instanceof HttpError ? error.message : error.toString();
  const data = error instanceof HttpError && error.data ? error.data : undefined;
  res.status(status).json({message, data});
});

let exp: any;

mongoose.connect(endpoint.databaseUrl()).then(() => {
  const server = app.listen(8000);
  exp = server;
  const io = socket.init(server);
  io.of('/rest').use((s, next) => {
    console.log('Client connected:', s.client.conn);
  });
  HouseKeeping.getInstance().start();
}).catch(reason => console.log(reason));

export default () => exp;
