import express from 'express';
import { body, param } from 'express-validator';

import {
    idParamValidator,
    mongoIdParamValidator,
    validate,
} from '../validators';
import { idField, pageField, itemsField, connectionRuleField, countField } from '../../util/fields.constants';
import {
    invalidListOfItemIdsMsg,
    noCommaSeparatedList,
    noDuplicateIdsMsg,
    invalidConfigurationItemIdMsg,
    invalidItemTypeMsg,
} from '../../util/messages.constants';
import {
    getConfigurationItems,
    getConfigurationItemsByIds,
    getConfigurationItemsByType,
} from '../../controllers/item-data/configuration-item.controller';
import { configurationItemModel } from '../../models/mongoose/configuration-item.model';
import { itemTypeModel } from '../../models/mongoose/item-type.model';

const router = express.Router();

const idArrayParamSanitizer = (fieldName: string) => param(fieldName, noCommaSeparatedList).trim().not().isEmpty().customSanitizer((value: string) => {
    const a = value.split(',');
    return a;
}).custom((value: string[]) => [...new Set(value)].length === value.length).withMessage(noDuplicateIdsMsg);

router.get('/', getConfigurationItems);

router.get(`/ByTypes/:${idField}`, [
    idArrayParamSanitizer(idField),
    mongoIdParamValidator(`${idField}.*`, invalidListOfItemIdsMsg).bail()
        .custom(itemTypeModel.validateIdExists).withMessage(invalidItemTypeMsg),
], validate, getConfigurationItemsByType);

router.get(`/Available/:${connectionRuleField}/:${countField}"`, [], validate);

router.get(`/ConnectableAsLowerItem/item/:${idField}/rule/${connectionRuleField}`, [
    idParamValidator,
], validate);

router.get(`/ConnectableAsUpperItem/item/:${idField}/rule/:${connectionRuleField}`, [
    idParamValidator,
], validate);

router.get(`/Search`, [], validate);

router.get(`/:${itemsField}`, [
    idArrayParamSanitizer(itemsField),
    mongoIdParamValidator(`${itemsField}.*`, invalidListOfItemIdsMsg).bail()
        .custom(configurationItemModel.validateIdExists).withMessage(invalidConfigurationItemIdMsg),
], validate, getConfigurationItemsByIds);

export default router;
