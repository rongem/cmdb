import express from 'express';
import { body, param } from 'express-validator';

import {
    idParamValidator,
    validate,
    mongoIdParamValidator,
    idBodyValidator,
    mongoIdBodyValidator,
} from '../validators';
import { isEditor } from '../../controllers/auth/authentication.controller';
import {
    idField,
    upperItemField,
    connectionTypeField,
    lowerItemField,
    typeIdField,
    upperItemIdField,
    lowerItemIdField,
    ruleIdField,
} from '../../util/fields.constants';
import {
    getConnection,
    getConnectionByContent,
    createConnection,
    updateConnection,
    deleteConnection,
} from '../../controllers/item-data/connection.controller';
import {
    invalidUpperIdInParamsMsg,
    invalidLowerIdInParamsMsg,
    invalidConnectionTypeMsg,
    invalidUpperItemIdMsg,
    invalidLowerItemIdMsg,
    invalidConnectionRuleMsg,
    ruleAndconnectionIdMismatchMsg,
    duplicateConnectionMsg,
} from '../../util/messages.constants';
import { configurationItemModel } from '../../models/mongoose/configuration-item.model';
import { connectionTypeModel } from '../../models/mongoose/connection-type.model';
import { connectionRuleModel } from '../../models/mongoose/connection-rule.model';
import { connectionModel } from '../../models/mongoose/connection.model';

const router = express.Router();
const upperItemIdBodyValidator = mongoIdBodyValidator(upperItemIdField, invalidUpperItemIdMsg).bail()
    .custom(configurationItemModel.validateIdExists);
const lowerItemIdBodyValidator = mongoIdBodyValidator(lowerItemIdField, invalidLowerItemIdMsg).bail()
    .custom(configurationItemModel.validateIdExists);
const ruleIdBodyValidator = mongoIdBodyValidator(ruleIdField, invalidConnectionRuleMsg).bail()
    .custom(connectionRuleModel.validateIdExists).bail()
    .custom((ruleId, { req }) => connectionModel.validateContentDoesNotExist(ruleId, req.body[upperItemIdField], req.body[lowerItemIdField]))
    .withMessage(duplicateConnectionMsg);
const typeIdBodyValidator = mongoIdBodyValidator(typeIdField, invalidConnectionTypeMsg).bail()
    .custom(connectionTypeModel.validateIdExists).bail().if(ruleIdBodyValidator)
    .custom((typeId, { req }) => connectionRuleModel.validateRuleIdAndTypeIdMatch(req.body[ruleIdField], typeId))
    .withMessage(ruleAndconnectionIdMismatchMsg);


// Create
router.post(`/`, [
    typeIdBodyValidator,
    upperItemIdBodyValidator,
    lowerItemIdBodyValidator,
    ruleIdBodyValidator,
], isEditor, validate, createConnection);

// Read
router.get(`/:${idField}`, [idParamValidator()], validate, getConnection);

router.get(`Connection/upperItem/:${upperItemField}/connectionType/:${connectionTypeField}/lowerItem/:${lowerItemField}`,
    [
        mongoIdParamValidator(upperItemField, invalidUpperIdInParamsMsg).bail()
            .custom(configurationItemModel.validateIdExists),
        mongoIdParamValidator(lowerItemField, invalidLowerIdInParamsMsg).bail()
            .custom(configurationItemModel.validateIdExists),
        mongoIdParamValidator(connectionTypeField, invalidConnectionTypeMsg).bail()
            .custom(connectionTypeModel.validateIdExists),
    ], validate, getConnectionByContent);

// Update
router.put(`/:${idField}`, [
    idParamValidator(),
    idBodyValidator(),
    typeIdBodyValidator,
    upperItemIdBodyValidator,
    lowerItemIdBodyValidator,
    ruleIdBodyValidator,
], isEditor, validate, updateConnection);

// Delete
router.delete(`/:${idField}`, [idParamValidator], isEditor, validate, deleteConnection);

export default router;
