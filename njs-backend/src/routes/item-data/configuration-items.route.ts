import express from 'express';
import { body, param } from 'express-validator';

import {
    idParamValidator,
    mongoIdParamValidator,
    pageValidator,
    validate,
} from '../validators';
import { idField, pageField, itemsField, connectionRuleField, countField } from '../../util/fields.constants';
import {
    invalidListOfItemIdsMsg,
    noCommaSeparatedList,
    noDuplicateIdsMsg,
    invalidConfigurationItemIdMsg,
    invalidItemTypeMsg,
    invalidConnectionRuleMsg,
} from '../../util/messages.constants';
import {
    getConfigurationItems,
    getConfigurationItemsByIds,
    getConfigurationItemsByType,
    getAvailableItemsForConnectionRuleAndCount,
    getConnectableAsLowerItem,
    getConnectableAsUpperItem,
    searchItems,
} from '../../controllers/item-data/configuration-item.controller';
import { configurationItemModel } from '../../models/mongoose/configuration-item.model';
import { itemTypeModel } from '../../models/mongoose/item-type.model';
import { connectionRuleModel } from '../../models/mongoose/connection-rule.model';

const router = express.Router();

const idArrayParamSanitizer = (fieldName: string) => param(fieldName, noCommaSeparatedList).trim().not().isEmpty().customSanitizer((value: string) => {
    const a = value.split(',');
    return a;
}).custom((value: string[]) => [...new Set(value)].length === value.length).withMessage(noDuplicateIdsMsg);
const connectionRuleParamValidator = mongoIdParamValidator(connectionRuleField, invalidConnectionRuleMsg).bail()
.custom(connectionRuleModel.validateIdExists);


router.get('/', [pageValidator], validate, getConfigurationItems);

router.get(`/ByTypes/:${idField}`, [
    idArrayParamSanitizer(idField),
    mongoIdParamValidator(`${idField}.*`, invalidListOfItemIdsMsg).bail()
        .custom(itemTypeModel.validateIdExists).withMessage(invalidItemTypeMsg),
], validate, getConfigurationItemsByType);

router.get(`/Available/:${connectionRuleField}/:${countField}"`, [
    connectionRuleParamValidator,
    param(countField).exists().bail().isInt({allow_leading_zeroes: false, min: 1, max: 10000}),
], validate, getAvailableItemsForConnectionRuleAndCount);

router.get(`/ConnectableAsLowerItem/item/:${idField}/rule/${connectionRuleField}`, [
    idParamValidator.bail()
        .custom(configurationItemModel.validateIdExists).withMessage(invalidConfigurationItemIdMsg),
    connectionRuleParamValidator,
], validate, getConnectableAsLowerItem);

router.get(`/ConnectableAsUpperItem/item/:${idField}/rule/:${connectionRuleField}`, [
    idParamValidator.bail()
        .custom(configurationItemModel.validateIdExists).withMessage(invalidConfigurationItemIdMsg),
    connectionRuleParamValidator,
], validate, getConnectableAsUpperItem);

router.get(`/Search`, [], validate, searchItems);

router.get(`/:${itemsField}`, [
    idArrayParamSanitizer(itemsField),
    mongoIdParamValidator(`${itemsField}.*`, invalidListOfItemIdsMsg).bail()
        .custom(configurationItemModel.validateIdExists).withMessage(invalidConfigurationItemIdMsg),
], validate, getConfigurationItemsByIds);

export default router;
