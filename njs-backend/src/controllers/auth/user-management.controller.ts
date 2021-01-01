import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

import { HttpError } from '../../rest-api/httpError.model';
import { IUser, userModel } from '../../models/mongoose/user.model';
import { serverError } from '../error.controller';
import endpointConfig from '../../util/endpoint.config';


