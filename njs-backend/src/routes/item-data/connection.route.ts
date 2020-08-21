import express from 'express';
import { body, param } from 'express-validator';

import {
    idParamValidator,
    validate,
    mongoIdParamValidator,
    idBodyValidator,
    idBodyAndParamValidator,
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
} from '../../util/messages.constants';
import { configurationItemModel } from '../../models/mongoose/configuration-item.model';
import { connectionTypeModel } from '../../models/mongoose/connection-type.model';
import { connectionRuleModel } from '../../models/mongoose/connection-rule.model';

const router = express.Router();
const typeIdBodyValidator = mongoIdBodyValidator(typeIdField, invalidConnectionTypeMsg).bail()
    .custom(connectionTypeModel.validateIdExists);
const upperItemIdBodyValidator = mongoIdParamValidator(upperItemIdField, invalidUpperItemIdMsg).bail()
    .custom(configurationItemModel.validateIdExists);
const lowerItemIdBodyValidator = mongoIdParamValidator(lowerItemIdField, invalidLowerItemIdMsg).bail()
    .custom(configurationItemModel.validateIdExists);
const ruleIdBodyValidator = mongoIdParamValidator(ruleIdField, invalidConnectionRuleMsg).bail()
    .custom(connectionRuleModel.validateIdExists); //tbd: check if rule and connection type are identical

// Create
router.post(`/`, [
    typeIdBodyValidator,
    upperItemIdBodyValidator,
    lowerItemIdBodyValidator,
    ruleIdBodyValidator,
], validate, createConnection);

// Read
router.get(`/:${idField}`, [idParamValidator], validate, getConnection);

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
    idParamValidator,
    idBodyValidator,
    idBodyAndParamValidator,
    typeIdBodyValidator,
    upperItemIdBodyValidator,
    lowerItemIdBodyValidator,
    ruleIdBodyValidator,
], validate, updateConnection);

// Delete
router.delete(`/:${idField}`, [idParamValidator], validate, deleteConnection);

export default router;
