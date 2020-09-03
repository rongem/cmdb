import express from 'express';
import { body } from 'express-validator';

import {
    nameBodyValidator,
    idParamValidator,
    namedObjectUpdateValidators,
    mongoIdBodyValidator,
    stringExistsBodyValidator,
    validate,
    mongoIdParamValidator,
    stringExistsParamValidator
} from '../validators';
import { isEditor } from '../../controllers/auth/authentication.controller';
import {
    createConfigurationItem,
    getConfigurationItem,
    updateConfigurationItem,
    deleteConfigurationItem,
    searchNeighbors,
    getConfigurationItemByTypeAndName,
    getConfigurationItemWithConnections,
    getConfigurationItemForAttributeId,
    getConfigurationItemForLinkId,
    takeResponsibilityForItem,
    abandonResponsibilityForItem,
    getConnectableAsLowerItem,
} from '../../controllers/item-data/configuration-item.controller';
import {
    idField,
    attributesField,
    typeIdField,
    valueField,
    linksField,
    uriField,
    descriptionField,
    nameField,
    responsibleUsersField,
    connectionRuleField,
    itemTypeField,
} from '../../util/fields.constants';
import {
    invalidItemTypeMsg,
    noAttributesArrayMsg,
    invalidAttributeTypeMsg,
    invalidAttributeValueMsg,
    noLinksArrayMsg,
    invalidDescriptionMsg,
    invalidURIMsg,
    noDuplicateTypesMsg,
    noMatchForRegexMsg,
    disallowedAttributeTypeMsg,
    duplicateObjectNameMsg,
    disallowedChangingOfItemTypeMsg,
    noDuplicateUrisMsg,
    noDuplicateUserNamesMsg,
    invalidConnectionRuleMsg,
    invalidNameMsg,
} from '../../util/messages.constants';
import { itemTypeModel } from '../../models/mongoose/item-type.model';
import { attributeTypeModel } from '../../models/mongoose/attribute-type.model';
import { configurationItemModel } from '../../models/mongoose/configuration-item.model';
import {
    getConnectionsForItem,
    getConnectionsForUpperItem,
    getConnectionsForLowerItem
} from '../../controllers/item-data/connection.controller';
import { connectionRuleModel } from '../../models/mongoose/connection-rule.model';

const router = express.Router();

const typeIdBodyValidator = () => mongoIdBodyValidator(typeIdField, invalidItemTypeMsg).bail()
    .custom(itemTypeModel.validateIdExists);
const typeIdBodyCreateValidator = typeIdBodyValidator().bail()
    .custom((value: string, { req }) =>
        configurationItemModel.validateNameDoesNotExistWithItemType(req.body[nameField], value)
    ).withMessage(duplicateObjectNameMsg);
const typeIdBodyUpdateValidator = typeIdBodyValidator().bail()
    .custom((value: string, { req }) => configurationItemModel.validateItemTypeUnchanged(req.body[idField], value))
    .withMessage(disallowedChangingOfItemTypeMsg);

const attributesBodyValidator = body(attributesField, noAttributesArrayMsg).if(body(attributesField).exists()).isArray().bail()
    .custom((value: any[]) => {
        const uniqueIds = [...new Set(value.map(v => v[typeIdField]))];
        return uniqueIds.length === value.length;
    }).withMessage(noDuplicateTypesMsg);
const attributesTypeIdBodyValidator = mongoIdBodyValidator(`${attributesField}.*.${typeIdField}`, invalidAttributeTypeMsg).bail()
    .custom(attributeTypeModel.validateIdExists).bail().custom((value: string, { req }) =>
        attributeTypeModel.validateIdExistsAndIsAllowedForItemType(value, req.body[typeIdField])
    ).withMessage(disallowedAttributeTypeMsg);
const attributesValueBodyValidator = stringExistsBodyValidator(`${attributesField}.*.${valueField}`, invalidAttributeValueMsg).bail()
    .custom((value: string, meta) => {
        const typeId = meta.req.body[attributesField][meta.path.split('[')[1].split(']')[0]][typeIdField];
        return attributeTypeModel.findById(typeId)
            .then(at => {
                if (!at) {
                    return Promise.reject();
                }
                const validationExpression = at.validationExpression;
                return new RegExp(validationExpression).test(value) ? Promise.resolve() : Promise.reject();
            })
            .catch(err => Promise.reject(err));
    }).withMessage(noMatchForRegexMsg);
const linksBodyValidator = body(linksField, noLinksArrayMsg).if(body(linksField).exists()).isArray().bail()
    .custom((value: any[]) => {
        const uniquiUris = [...new Set(value.map(l => l[uriField]))];
        return uniquiUris.length === value.length;
    }).withMessage(noDuplicateUrisMsg);
const linkUriBodyValidator = body(`${linksField}.*.${uriField}`).trim().isURL({
    allow_protocol_relative_urls: false,
    allow_trailing_dot: false,
    require_protocol: true,
    require_host: true,
    protocols: ['http', 'https'],
    disallow_auth: true,
}).withMessage(invalidURIMsg);
const linkDescriptionBodyValidator = stringExistsBodyValidator(`${linksField}.*.${descriptionField}`, invalidDescriptionMsg);
const usersBodyValidator = body(responsibleUsersField, noAttributesArrayMsg).if(body(responsibleUsersField).exists()).isArray().bail()
    .custom((value: string[]) => {
        const uniqueNames = [...new Set(value)];
        return uniqueNames.length === value.length;
    }).withMessage(noDuplicateUserNamesMsg);
const connectionRuleParamValidator = mongoIdParamValidator(connectionRuleField, invalidConnectionRuleMsg).bail()
    .custom(connectionRuleModel.validateIdExists); // tbd: check if rule lower item type fits to objects item type

const itemTypeParamValidator = mongoIdParamValidator(typeIdField, invalidItemTypeMsg).bail()
    .custom(itemTypeModel.validateIdExists);

const itemNameParamValidator = stringExistsParamValidator(nameField, invalidNameMsg).bail()
    .customSanitizer(val => decodeURIComponent(val));

// Create
router.post('/', [
    nameBodyValidator,
    typeIdBodyCreateValidator,
    attributesBodyValidator,
    attributesTypeIdBodyValidator,
    attributesValueBodyValidator,
    linksBodyValidator,
    linkUriBodyValidator,
    linkDescriptionBodyValidator,
    usersBodyValidator,
], isEditor, validate, createConfigurationItem);

// Read
router.get(`/:${idField}`, [idParamValidator()], validate, getConfigurationItem);

router.get(`/:${idField}/Full`, [idParamValidator()], validate, getConfigurationItemWithConnections);

router.post(`/:${idField}/Responsibility`, [idParamValidator()], validate, takeResponsibilityForItem);

router.delete(`/:${idField}/Responsibility`, [idParamValidator()], validate, abandonResponsibilityForItem);

router.get(`/type/:${typeIdField}/name/:${nameField}`, [
    itemTypeParamValidator,
    itemNameParamValidator,
], validate, getConfigurationItemByTypeAndName);

router.get(`/Attribute/:${idField}`, [idParamValidator()], validate, getConfigurationItemForAttributeId);

router.get(`/Link/:${idField}`, [idParamValidator()], validate, getConfigurationItemForLinkId);

router.get(`/:${idField}/Connectable/:${connectionRuleField}`, [
    idParamValidator(),
    connectionRuleParamValidator,
], validate, getConnectableAsLowerItem);

router.get(`/:${idField}/Connections`, [idParamValidator()], validate, getConnectionsForItem);

router.get(`/:${idField}/Connections/ToLower`, [idParamValidator()], validate, getConnectionsForUpperItem);

router.get(`/:${idField}/Connections/ToUpper`, [idParamValidator()], validate, getConnectionsForLowerItem);

router.get(`/:${idField}/Search/Neighbor`, [
    idParamValidator(),
], validate, searchNeighbors);

// Update
router.put(`/:${idField}`, [
    ...namedObjectUpdateValidators,
    typeIdBodyUpdateValidator,
    attributesBodyValidator,
    attributesTypeIdBodyValidator,
    attributesValueBodyValidator,
    linksBodyValidator,
    linkUriBodyValidator,
    linkDescriptionBodyValidator,
    usersBodyValidator,
], isEditor, validate, updateConfigurationItem);

// Delete
router.delete(`/:${idField}`, [idParamValidator()], isEditor, validate, deleteConfigurationItem);

export default router;
