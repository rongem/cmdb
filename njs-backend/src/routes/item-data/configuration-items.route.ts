import express from 'express';
import { body, param } from 'express-validator';

import {
    idParamValidator,
    mongoIdParamValidator,
    pageValidator,
    searchNameOrValueValidator,
    searchArrayValidator,
    searchConnectionTypeValidator,
    searchConnectionCountValidator,
    searchConnectionItemTypeValidator,
    searchDateValidator,
    searchItemTypeIdValidator,
    searchResponsibleUserValidator,
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
    listCountField,
} from '../../util/fields.constants';
import {
    invalidListOfItemIdsMsg,
    noCommaSeparatedListMsg,
    noDuplicateIdsMsg,
    invalidConfigurationItemIdMsg,
    invalidItemTypeMsg,
    invalidConnectionRuleMsg,
    invalidConnectionsToUpperArrayMsg,
    invalidConnectionsToLowerArrayMsg,
    invalidChangedAfterMsg,
    invalidChangedBeforeMsg,
    noCriteriaForSearchMsg,
    invalidAttributeTypeMsg,
    invalidConnectionsSearchWithoutItemTypeMsg,
    invalidDateOrderMsg,
    invalidAttributesMsg,
    invalidCountMsg,
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
    searchFullItems,
    getFullConfigurationItemsByIds,
    getRecentlyModifiedItems,
} from '../../controllers/item-data/configuration-item.controller';
import { configurationItemValidateIdExists } from '../../models/abstraction-layer/item-data/configuration-item.al';
import { itemTypeModelValidateIdExists } from '../../models/abstraction-layer/meta-data/item-type.al';
import { connectionRuleModelValidateIdExists } from '../../models/abstraction-layer/meta-data/connection-rule.al';
import { attributeTypeModelValidateIdExists } from '../../models/abstraction-layer/meta-data/attribute-type.al';

const router = express.Router();

const idArrayParamSanitizer = (fieldName: string) => param(fieldName, noCommaSeparatedListMsg).trim().not().isEmpty().customSanitizer((value: string) => {
    const a = value.split(',');
    return a;
}).custom((value: string[]) => [...new Set(value)].length === value.length).withMessage(noDuplicateIdsMsg);
const connectionRuleParamValidator = mongoIdParamValidator(connectionRuleField, invalidConnectionRuleMsg).bail()
    .custom(connectionRuleModelValidateIdExists);

const searchValidators = [
    searchNameOrValueValidator(nameOrValueField),
    searchItemTypeIdValidator(itemTypeIdField),
    searchArrayValidator(attributesField, invalidAttributesMsg),
    body(`${attributesField}.*.${typeIdField}`, invalidAttributeTypeMsg).if(body(attributesField).exists()).isMongoId().bail()
        .custom(attributeTypeModelValidateIdExists),
    searchArrayValidator(connectionsToLowerField, invalidConnectionsToLowerArrayMsg),
    searchArrayValidator(connectionsToUpperField, invalidConnectionsToUpperArrayMsg),
    searchDateValidator(changedAfterField, invalidChangedAfterMsg),
    searchDateValidator(changedBeforeField, invalidChangedBeforeMsg),
    body(changedBeforeField, invalidDateOrderMsg).optional().if(body(changedAfterField).exists())
        .custom((changedBefore, { req }) => Date.parse(changedBefore) > Date.parse(req.body[changedAfterField])),
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
];

router.get('/', [pageValidator], validate, getConfigurationItems);

router.post(`/Search`, searchValidators, validate, searchItems);

router.post(`/Full/Search`, searchValidators, validate, searchFullItems);

router.get(`/ByTypes/:${idField}`, [
    idArrayParamSanitizer(idField),
    mongoIdParamValidator(`${idField}.*`, invalidListOfItemIdsMsg).bail()
        .custom(itemTypeModelValidateIdExists).withMessage(invalidItemTypeMsg),
], validate, getConfigurationItemsByTypes);

router.get(`/ByTypes/:${idField}/Full`, [
    idArrayParamSanitizer(idField),
    mongoIdParamValidator(`${idField}.*`, invalidListOfItemIdsMsg).bail()
        .custom(itemTypeModelValidateIdExists).withMessage(invalidItemTypeMsg),
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
        .custom(configurationItemValidateIdExists).withMessage(invalidConfigurationItemIdMsg),
    connectionRuleParamValidator,
], validate, getConnectableAsLowerItem);

router.get(`/ConnectableAsUpperItem/item/:${idField}/rule/:${connectionRuleField}`, [
    idParamValidator().bail()
        .custom(configurationItemValidateIdExists).withMessage(invalidConfigurationItemIdMsg),
    connectionRuleParamValidator,
], validate, getConnectableAsUpperItem);

router.get(`/Recent/:${listCountField}`, [
    param(listCountField, invalidCountMsg).isInt({allow_leading_zeroes: false, min: 1, max: 1000}),
], validate, getRecentlyModifiedItems);

router.get(`/:${itemsField}`, [
    idArrayParamSanitizer(itemsField),
    mongoIdParamValidator(`${itemsField}.*`, invalidListOfItemIdsMsg).bail()
        .custom(configurationItemValidateIdExists).withMessage(invalidConfigurationItemIdMsg),
], validate, getConfigurationItemsByIds);

router.get(`/:${itemsField}/Full`, [
    idArrayParamSanitizer(itemsField),
    mongoIdParamValidator(`${itemsField}.*`, invalidListOfItemIdsMsg).bail()
        .custom(configurationItemValidateIdExists).withMessage(invalidConfigurationItemIdMsg),
], validate, getFullConfigurationItemsByIds);

export default router;
