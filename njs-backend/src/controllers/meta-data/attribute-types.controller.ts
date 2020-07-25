import { Request, Response, NextFunction } from 'express';

import attributeGroups from '../../models/mongoose/attribute-group.model';
import attributeTypes from '../../models/mongoose/attribute-type.model';
import { AttributeType } from '../../models/meta-data/attribute-type.model';
import { handleValidationErrors } from '../../routes/validators';
import { serverError, notFoundError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import socket from '../socket.controller';

// read
export function getAttributeTypes(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    attributeTypes.find()
        .then(attributeTypes => res.send(attributeTypes.map(at => new AttributeType(at))))
        .catch(error => serverError(next, error));
}

// create

// update

// delete
