import express from 'express';
import { body } from 'express-validator';

import {
    idParamValidator,
    validate,
    mongoIdParamValidator,
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
    descriptionField,
    validationExpressionField,
    connectionRuleField,
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
    invalidDescriptionMsg,
} from '../../util/messages.constants';
import { connectionTypeModel } from '../../models/mongoose/connection-type.model';
import { connectionRuleModel } from '../../models/mongoose/connection-rule.model';
import { connectionModel } from '../../models/mongoose/connection.model';
import { configurationItemValidateIdExists } from '../../models/abstraction-layer/item-data/configuration-item.al';
import { connectionByIdPopulated } from '../../models/abstraction-layer/item-data/connection.al';

const router = express.Router();
const upperItemIdBodyValidator = mongoIdBodyValidator(upperItemIdField, invalidUpperItemIdMsg).bail()
    .custom(configurationItemValidateIdExists);
const lowerItemIdBodyValidator = mongoIdBodyValidator(lowerItemIdField, invalidLowerItemIdMsg).bail()
    .custom(configurationItemValidateIdExists);
const ruleIdBodyValidator = mongoIdBodyValidator(ruleIdField, invalidConnectionRuleMsg).bail()
    .custom(async (ruleId, { req }) => {
        req.connectionRule = await connectionRuleModel.findById(ruleId);
        return req.connectionRule ? Promise.resolve() : Promise.reject();
    }).bail()
    .custom((ruleId, { req }) =>
        connectionModel.validateContentDoesNotExist(ruleId, req.body[upperItemIdField], req.body[lowerItemIdField], req.params ? req.params[idField] : ''))
    .withMessage(duplicateConnectionMsg);
const descriptionBodyValidator = body(descriptionField, invalidDescriptionMsg).default('')
    .custom((description, { req }) => {
        return new RegExp(req.connectionRule[validationExpressionField]).test(description);
    });
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
    descriptionBodyValidator,
], isEditor, validate, createConnection);

// Read
router.get(`/:${idField}`, [idParamValidator()], validate, getConnection);

router.get(`/upperItem/:${upperItemField}/connectionType/:${connectionTypeField}/lowerItem/:${lowerItemField}`,
    [
        mongoIdParamValidator(upperItemField, invalidUpperIdInParamsMsg).bail()
            .custom(configurationItemValidateIdExists),
        mongoIdParamValidator(lowerItemField, invalidLowerIdInParamsMsg).bail()
            .custom(configurationItemValidateIdExists),
        mongoIdParamValidator(connectionTypeField, invalidConnectionTypeMsg).bail()
            .custom(connectionTypeModel.validateIdExists),
    ], validate, getConnectionByContent);

// Update
router.put(`/:${idField}/description`, [
    idParamValidator().bail().custom(async (id: string, { req }) => {
        req.conn = await connectionByIdPopulated(id);
        if (!req.conn) {
            return Promise.reject();
        }
        req.connectionRule = await (connectionRuleModel.findById(req.conn[connectionRuleField]));
        return req.connectionRule ? Promise.resolve() : Promise.reject();
    }).bail().custom((id: string, { req }) =>
        new RegExp(req.connectionRule[validationExpressionField]).test(req.body[descriptionField])
    ).withMessage(invalidDescriptionMsg),
], isEditor, validate, updateConnection);

// Delete
router.delete(`/:${idField}`, [idParamValidator()], isEditor, validate, deleteConnection);

export default router;
