import express from 'express';
import { body, param } from 'express-validator';

import {
    idParamValidator,
    mongoIdParamValidator,
    pageValidator,
    validate,
} from '../validators';
import {
    idField,
    itemsField,
    connectionRuleField,
    countField,
    nameOrValueField,
    itemTypeIdField,
    attributesField,
    connectionsToLowerField,
    connectionsToUpperField,
    changedAfterField,
    responsibleUserField,
    typeIdField,
    changedBeforeField,
    connectionTypeIdField,
} from '../../util/fields.constants';
import {
    invalidListOfItemIdsMsg,
    noCommaSeparatedListMsg,
    noDuplicateIdsMsg,
    invalidConfigurationItemIdMsg,
    invalidItemTypeMsg,
    invalidConnectionRuleMsg,
    invalidNameMsg,
    invalidConnectionsToUpperArrayMsg,
    invalidConnectionsToLowerArrayMsg,
    invalidChangedAfterMsg,
    invalidChangedBeforeMsg,
    invalidResponsibleUserMsg,
    noCriteriaForSearchMsg,
    invalidAttributeTypeMsg,
    invalidConnectionsSearchWithoutItemTypeMsg,
    invalidDateOrderMsg,
    invalidConnectionTypeMsg,
    invalidCountMsg,
    invalidAttributesMsg,
} from '../../util/messages.constants';
import {
    getConfigurationItems,
    getConfigurationItemsByIds,
    getConfigurationItemsByTypes,
    getAvailableItemsForConnectionRuleAndCount,
    getConnectableAsLowerItem,
    getConnectableAsUpperItem,
    getConfigurationItemsByTypeWithConnections,
    searchItems,
    getFullConfigurationItemsByIds,
} from '../../controllers/item-data/configuration-item.controller';
import { configurationItemModel } from '../../models/mongoose/configuration-item.model';
import { itemTypeModel } from '../../models/mongoose/item-type.model';
import { connectionRuleModel } from '../../models/mongoose/connection-rule.model';
import { attributeTypeModel } from '../../models/mongoose/attribute-type.model';
import { connectionTypeModel } from '../../models/mongoose/connection-type.model';

const router = express.Router();

const idArrayParamSanitizer = (fieldName: string) => param(fieldName, noCommaSeparatedListMsg).trim().not().isEmpty().customSanitizer((value: string) => {
    const a = value.split(',');
    return a;
}).custom((value: string[]) => [...new Set(value)].length === value.length).withMessage(noDuplicateIdsMsg);
const connectionRuleParamValidator = mongoIdParamValidator(connectionRuleField, invalidConnectionRuleMsg).bail()
    .custom(connectionRuleModel.validateIdExists);

const searchNameOrValueValidator = (field: string) => body(field, invalidNameMsg).if(body(field).exists())
    .trim().isLength({min: 1}).customSanitizer((value: string) => value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')); // replace regex characters
const searchItemTypeIdValidator = (field: string) => body(field, invalidItemTypeMsg).if(body(field).exists()).trim().isMongoId().bail()
    .custom(itemTypeModel.validateIdExists);
const searchArrayValidator = (field: string, message: string) => body(field, message).if(body(field).exists()).isArray();
const searchDateValidator = (field: string, message: string) => body(field, message).if(body(field).exists())
    .custom(value => !isNaN(Date.parse(value))).customSanitizer(value => new Date(value));
const searchResponsibleUserValidator = (field: string) => body(field, invalidResponsibleUserMsg).if(body(field).exists()).trim().isLength({min: 1});
const searchConnectionTypeValidator = (field: string) => body(`${field}.*.${connectionTypeIdField}`, invalidConnectionTypeMsg)
    .if(body(field).exists).optional().isMongoId().bail().custom(itemTypeModel.validateIdExists);
const searchConnectionItemTypeValidator = (field: string) => body(`${field}.*.${itemTypeIdField}`, invalidConnectionTypeMsg)
    .if(body(field).exists).isMongoId().bail().custom(connectionTypeModel.validateIdExists);
const searchConnectionCountValidator = (field: string) => body(`${field}.*.${countField}`, invalidCountMsg).if(body(connectionsToLowerField).exists)
    .isLength({min: 1, max: 2}).bail().custom((value: string) => ['0', '1', '1+', '2+'].includes(value));

router.get('/', [pageValidator], validate, getConfigurationItems);

router.search(`/`, [
    searchNameOrValueValidator(nameOrValueField),
    searchItemTypeIdValidator(itemTypeIdField),
    searchArrayValidator(attributesField, invalidAttributesMsg),
    body(`${attributesField}.*.${typeIdField}`, invalidAttributeTypeMsg).if(body(attributesField).exists()).isMongoId().bail()
        .custom(attributeTypeModel.validateIdExists),
    searchArrayValidator(connectionsToLowerField, invalidConnectionsToLowerArrayMsg),
    searchArrayValidator(connectionsToUpperField, invalidConnectionsToUpperArrayMsg),
    searchDateValidator(changedAfterField, invalidChangedAfterMsg),
    searchDateValidator(changedBeforeField, invalidChangedBeforeMsg),
    body(changedBeforeField, invalidDateOrderMsg).if(body(changedBeforeField).exists() && body(changedAfterField).exists())
        .custom((changedBefore, { req }) => changedBefore > req.body[changedAfterField]),
    searchResponsibleUserValidator(responsibleUserField),
    body(nameOrValueField, noCriteriaForSearchMsg).custom((value: string, { req }) =>
        value || req.body[itemTypeIdField] || req.body[attributesField] || req.body[responsibleUserField]
    ),
    body(itemTypeIdField, invalidConnectionsSearchWithoutItemTypeMsg)
        .custom((itemType: string, { req }) => (req.body[connectionsToLowerField] || req.body[connectionsToUpperField] ? !!itemType : true)),
    searchConnectionTypeValidator(connectionsToLowerField),
    searchConnectionItemTypeValidator(connectionsToLowerField),
    searchConnectionCountValidator(connectionsToLowerField),
    searchConnectionTypeValidator(connectionsToUpperField),
    searchConnectionItemTypeValidator(connectionsToUpperField),
    searchConnectionCountValidator(connectionsToUpperField),
], validate, searchItems);

router.get(`/ByTypes/:${idField}`, [
    idArrayParamSanitizer(idField),
    mongoIdParamValidator(`${idField}.*`, invalidListOfItemIdsMsg).bail()
        .custom(itemTypeModel.validateIdExists).withMessage(invalidItemTypeMsg),
], validate, getConfigurationItemsByTypes);

router.get(`/ByTypes/:${idField}/Full`, [
    idArrayParamSanitizer(idField),
    mongoIdParamValidator(`${idField}.*`, invalidListOfItemIdsMsg).bail()
        .custom(itemTypeModel.validateIdExists).withMessage(invalidItemTypeMsg),
], validate, getConfigurationItemsByTypeWithConnections);

router.get(`/Available/:${connectionRuleField}/:${countField}`, [
    connectionRuleParamValidator,
    param(countField).exists().bail().isInt({allow_leading_zeroes: false, min: 1, max: 10000}),
], validate, getAvailableItemsForConnectionRuleAndCount);

router.get(`/ConnectableAsLowerItem/rule/:${connectionRuleField}`, [
    connectionRuleParamValidator,
], validate, getConnectableAsLowerItem);

router.get(`/ConnectableAsLowerItem/item/:${idField}/rule/:${connectionRuleField}`, [
    idParamValidator().bail()
        .custom(configurationItemModel.validateIdExists).withMessage(invalidConfigurationItemIdMsg),
    connectionRuleParamValidator,
], validate, getConnectableAsLowerItem);

router.get(`/ConnectableAsUpperItem/item/:${idField}/rule/:${connectionRuleField}`, [
    idParamValidator().bail()
        .custom(configurationItemModel.validateIdExists).withMessage(invalidConfigurationItemIdMsg),
    connectionRuleParamValidator,
], validate, getConnectableAsUpperItem);

router.get(`/:${itemsField}`, [
    idArrayParamSanitizer(itemsField),
    mongoIdParamValidator(`${itemsField}.*`, invalidListOfItemIdsMsg).bail()
        .custom(configurationItemModel.validateIdExists).withMessage(invalidConfigurationItemIdMsg),
], validate, getConfigurationItemsByIds);

router.get(`/:${itemsField}/Full`, [
    idArrayParamSanitizer(itemsField),
    mongoIdParamValidator(`${itemsField}.*`, invalidListOfItemIdsMsg).bail()
        .custom(configurationItemModel.validateIdExists).withMessage(invalidConfigurationItemIdMsg),
], validate, getFullConfigurationItemsByIds);

export default router;
