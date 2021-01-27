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
    stringExistsParamValidator,
    arrayBodyValidator,
    searchArrayValidator,
    searchConnectionCountValidator,
    searchConnectionItemTypeValidator,
    searchConnectionTypeValidator,
    searchDateValidator,
    searchItemTypeIdValidator,
    searchNameOrValueValidator,
    searchResponsibleUserValidator,
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
    connectionsToUpperField,
    connectionsToLowerField,
    ruleIdField,
    targetIdField,
    connectionTypeField,
    typeField,
    maxLevelsField,
    searchDirectionField,
    extraSearchField,
    nameOrValueField,
    changedAfterField,
    changedBeforeField,
    responsibleUserField,
    itemTypeIdField,
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
    invalidConnectionsToUpperPresentMsg,
    invalidConnectionsToUpperArrayMsg,
    invalidConnectionsToLowerArrayMsg,
    invalidConnectionContentMsg,
    invalidConnectionTypeMsg,
    invalidConfigurationItemIdMsg,
    disallowedItemByRuleMsg,
    invalidMaxLevelsMsg,
    invalidSearchDirectionMsg,
    searchDirectionMsg,
    invalidChangedAfterMsg,
    invalidChangedBeforeMsg,
    invalidDateOrderMsg,
    invalidConnectionsSearchWithoutItemTypeMsg,
    noCriteriaForSearchMsg,
} from '../../util/messages.constants';
import { itemTypeModel } from '../../models/mongoose/item-type.model';
import { attributeTypeModel, IAttributeType } from '../../models/mongoose/attribute-type.model';
import { configurationItemModel, IConfigurationItem } from '../../models/mongoose/configuration-item.model';
import {
    getConnectionsForItem,
    getConnectionsForUpperItem,
    getConnectionsForLowerItem
} from '../../controllers/item-data/connection.controller';
import { connectionRuleModel, IConnectionRule } from '../../models/mongoose/connection-rule.model';
import { modelGetAllowedLowerConfigurationItemsForRule, modelGetAllowedUpperConfigurationItemsForRule } from '../../controllers/item-data/multi-model.al';
import { ProtoConnection } from '../../models/item-data/full/proto-connection.model';

const router = express.Router();

const typeIdBodyValidator = () => mongoIdBodyValidator(typeIdField, invalidItemTypeMsg).bail()
    .custom(async (value: string, { req }) => {
        try {
            req.itemType = await itemTypeModel.findById(value);
            return req.itemType ? Promise.resolve() : Promise.reject();
        } catch (error) {
            return Promise.reject(error);
        }
    });
const typeIdBodyCreateValidator = typeIdBodyValidator().bail()
    .custom((value: string, { req }) =>
        configurationItemModel.validateNameDoesNotExistWithItemType(req.body[nameField], value)
    ).withMessage(duplicateObjectNameMsg);
const typeIdBodyUpdateValidator = typeIdBodyValidator().bail()
    .custom((value: string, { req }) => configurationItemModel.validateItemTypeUnchanged(req.body[idField], value))
    .withMessage(disallowedChangingOfItemTypeMsg);

const attributesBodyValidator = arrayBodyValidator(attributesField, noAttributesArrayMsg).bail()
    .custom((value: { [typeIdField]: string }[]) => {
        const uniqueIds = [...new Set(value.map(v => v[typeIdField]))];
        return uniqueIds.length === value.length;
    }).withMessage(noDuplicateTypesMsg);
const attributesTypeIdBodyValidator = mongoIdBodyValidator(`${attributesField}.*.${typeIdField}`, invalidAttributeTypeMsg).bail()
    .custom(async (value: string, { req }) => {
        if (!req.attributeTypes) {
            const attributeTypeIds = (req.body[attributesField] as { [typeIdField]: string }[]).map(a => a[typeIdField]);
            req.attributeTypes = await attributeTypeModel.find({_id: { $in: attributeTypeIds }});
        }
        return (req.attributeTypes.find((at: IAttributeType) => at.id === value)) ? Promise.resolve() : Promise.reject();
    }).bail()
    .custom (async (value: string, { req }) => {
        const attributeType = req.attributeTypes.find((at: IAttributeType) => at.id === value) as IAttributeType;
        return req.itemType.attributeGroups.includes(attributeType.attributeGroup.id) ? Promise.resolve() : Promise.reject();
    }).withMessage(disallowedAttributeTypeMsg);
const attributesValueBodyValidator = stringExistsBodyValidator(`${attributesField}.*.${valueField}`, invalidAttributeValueMsg).bail()
    .custom((value: string, meta) => {
        const typeId = meta.req.body[attributesField][meta.path.split('[')[1].split(']')[0]][typeIdField];
        try {
            const attributeType = meta.req.attributeTypes.find((at: IAttributeType) => at.id === typeId) as IAttributeType;
            const validationExpression = attributeType.validationExpression;
            return new RegExp(validationExpression).test(value);
        }
        catch (err) {
            return false;
        }
    }).withMessage(noMatchForRegexMsg);
const linksBodyValidator = body(linksField, noLinksArrayMsg).optional().isArray().bail()
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
const usersBodyValidator = body(responsibleUsersField, noAttributesArrayMsg).optional().isArray().bail()
    .custom((value: string[]) => {
        const uniqueNames = [...new Set(value.filter(v => !!v).map(v => v.toLocaleLowerCase()))];
        return uniqueNames.length === value.length;
    }).withMessage(noDuplicateUserNamesMsg);
const userBodyValidator = body(`${responsibleUsersField}.*`).toLowerCase().notEmpty();
const connectionRuleParamValidator = mongoIdParamValidator(connectionRuleField, invalidConnectionRuleMsg).bail()
    .custom(connectionRuleModel.validateIdExists); // tbd: check if rule lower item type fits to objects item type

const itemTypeParamValidator = mongoIdParamValidator(typeIdField, invalidItemTypeMsg).bail()
    .custom(itemTypeModel.validateIdExists);

const itemNameParamValidator = stringExistsParamValidator(nameField, invalidNameMsg).bail()
    .customSanitizer(val => decodeURIComponent(val));

const fullConnectionsContentBodyValidator = (fieldName: string) => body(`${fieldName}.*`, invalidConnectionContentMsg)
    .custom(async (value: ProtoConnection, { req }) => {
        if (!req.connectionRules) {
            const ruleIds = (req.body[connectionsToUpperField] as {[ruleIdField]: string}[] ?? []).map(c => c[ruleIdField]).concat(
                (req.body[connectionsToLowerField] as {[ruleIdField]: string}[] ?? []).map(c => c[ruleIdField]));
            req.connectionRules = await connectionRuleModel.find({ _id: { $in: ruleIds }}).populate(connectionTypeField);
        }
        if (!req.configurationItems) {
            const targetIds = (req.body[connectionsToUpperField] as {[targetIdField]: string}[] ?? []).map(c => c[targetIdField]).concat(
                (req.body[connectionsToLowerField] as {[targetIdField]: string}[] ?? []).map(c => c[targetIdField]));
            req.configurationItems = await configurationItemModel.find({ _id: { $in: targetIds }}).populate(typeField);
        }
        if (!value[ruleIdField]) {
            return Promise.reject('No rule id present.');
        }
        if (!value[targetIdField]) {
            return Promise.reject('No target id present.');
        }
        const rule: IConnectionRule = req.connectionRules.find((r: IConnectionRule) => r.id === value[ruleIdField]);
        if (!rule) {
            return Promise.reject(invalidConnectionRuleMsg);
        }
        if (value[typeIdField] && rule.connectionType.toString() !== value[typeIdField]) {
            return Promise.reject(invalidConnectionTypeMsg);
        }
        if (!(new RegExp(rule.validationExpression).test(value[descriptionField]))) {
            return Promise.reject(noMatchForRegexMsg);
        }
        const targetItem: IConfigurationItem = req.configurationItems.find((i: IConfigurationItem) => i.id === value[targetIdField]);
        if (!targetItem) {
            return Promise.reject(invalidConfigurationItemIdMsg);
        }
        if (fieldName === connectionsToUpperField) {
            if (targetItem.type.id !== rule.upperItemType.toString()) {
                return Promise.reject(invalidItemTypeMsg);
            }
            const allowedItems = await modelGetAllowedUpperConfigurationItemsForRule(value[ruleIdField]);
            if (!allowedItems.map(i => i.id)) {
                return Promise.reject(disallowedItemByRuleMsg);
            }
        }
        if (fieldName === connectionsToLowerField) {
            if (targetItem.type.id !== rule.lowerItemType.toString()) {
                return Promise.reject(invalidItemTypeMsg);
            }
            const allowedItems = await modelGetAllowedLowerConfigurationItemsForRule(value[ruleIdField]);
            if (!allowedItems.map(i => i.id)) {
                return Promise.reject(disallowedItemByRuleMsg);
            }
        }
        return Promise.resolve();
    });

// Create
router.post('/', [
    nameBodyValidator(),
    typeIdBodyCreateValidator,
    attributesBodyValidator,
    attributesTypeIdBodyValidator,
    attributesValueBodyValidator,
    linksBodyValidator,
    linkUriBodyValidator,
    linkDescriptionBodyValidator,
    usersBodyValidator,
    userBodyValidator,
    body([connectionsToLowerField, connectionsToUpperField], invalidConnectionsToUpperPresentMsg).not().exists(),
], isEditor, validate, createConfigurationItem);

// Create
router.post('/Full', [
    nameBodyValidator(),
    typeIdBodyCreateValidator,
    attributesBodyValidator,
    attributesTypeIdBodyValidator,
    attributesValueBodyValidator,
    linksBodyValidator,
    linkUriBodyValidator,
    linkDescriptionBodyValidator,
    usersBodyValidator,
    userBodyValidator,
    arrayBodyValidator(connectionsToUpperField, invalidConnectionsToUpperArrayMsg),
    arrayBodyValidator(connectionsToLowerField, invalidConnectionsToLowerArrayMsg),
    fullConnectionsContentBodyValidator(connectionsToUpperField),
    fullConnectionsContentBodyValidator(connectionsToLowerField),
], isEditor, validate, createConfigurationItem);

// Read
router.get(`/:${idField}`, [idParamValidator()], validate, getConfigurationItem);

router.get(`/:${idField}/Full`, [idParamValidator()], validate, getConfigurationItemWithConnections);

router.get(`/type/:${typeIdField}/name/:${nameField}`, [
    itemTypeParamValidator,
    itemNameParamValidator,
], validate, getConfigurationItemByTypeAndName);

router.get(`/Attribute/:${idField}`, [idParamValidator()], validate, getConfigurationItemForAttributeId);

router.get(`/Link/:${idField}`, [idParamValidator()], validate, getConfigurationItemForLinkId);

router.get(`/:${idField}/Connections`, [idParamValidator()], validate, getConnectionsForItem);

router.get(`/:${idField}/Connections/ToLower`, [idParamValidator()], validate, getConnectionsForUpperItem);

router.get(`/:${idField}/Connections/ToUpper`, [idParamValidator()], validate, getConnectionsForLowerItem);

router.search(`/:${idField}`, [
    idParamValidator(),
    searchItemTypeIdValidator(itemTypeIdField),
    body(maxLevelsField, invalidMaxLevelsMsg).isInt({min: 1, max: 10}),
    body(searchDirectionField, invalidSearchDirectionMsg).isLength({min: 2, max: 4}).toLowerCase().custom(value => searchDirectionMsg.includes(value)),
    searchNameOrValueValidator(`${extraSearchField}.${nameOrValueField}`),
    searchItemTypeIdValidator(`${extraSearchField}.${nameOrValueField}`).custom((value, { req }) => value === req.body[typeIdField]),
    searchArrayValidator(`${extraSearchField}.${connectionsToLowerField}`, invalidConnectionsToLowerArrayMsg),
    searchArrayValidator(`${extraSearchField}.${connectionsToUpperField}`, invalidConnectionsToUpperArrayMsg),
    searchDateValidator(`${extraSearchField}.${changedAfterField}`, invalidChangedAfterMsg),
    searchDateValidator(`${extraSearchField}.${changedBeforeField}`, invalidChangedBeforeMsg),
    body(`${extraSearchField}.${changedBeforeField}`, invalidDateOrderMsg).optional().if(body(`${extraSearchField}.${changedAfterField}`).exists())
        .custom((changedBefore, { req }) => Date.parse(changedBefore) > Date.parse(req.body[extraSearchField][changedAfterField])),
    searchResponsibleUserValidator(responsibleUserField),
    body(`${extraSearchField}.${nameOrValueField}`, noCriteriaForSearchMsg).if(body(extraSearchField).exists()).custom((value: string, { req }) =>
        value || req.body[extraSearchField][itemTypeIdField] || req.body[extraSearchField][attributesField] ||
        req.body[extraSearchField][responsibleUserField]
    ),
    body(`${extraSearchField}.${itemTypeIdField}`, invalidConnectionsSearchWithoutItemTypeMsg).optional()
        .custom((itemType: string, { req }) => (req.body[extraSearchField][connectionsToLowerField] ||
            req.body[extraSearchField][connectionsToUpperField] ? !!itemType : true)),
    searchConnectionTypeValidator(`${extraSearchField}.${connectionsToLowerField}`),
    searchConnectionItemTypeValidator(`${extraSearchField}.${connectionsToLowerField}`),
    searchConnectionCountValidator(`${extraSearchField}.${connectionsToLowerField}`),
    searchConnectionTypeValidator(`${extraSearchField}.${connectionsToUpperField}`),
    searchConnectionItemTypeValidator(`${extraSearchField}.${connectionsToUpperField}`),
    searchConnectionCountValidator(`${extraSearchField}.${connectionsToUpperField}`),

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
    userBodyValidator,
], isEditor, validate, updateConfigurationItem);

router.post(`/:${idField}/Responsibility`, [idParamValidator()], validate, takeResponsibilityForItem);

// Delete
router.delete(`/:${idField}`, [idParamValidator()], isEditor, validate, deleteConfigurationItem);

router.delete(`/:${idField}/Responsibility`, [idParamValidator()], validate, abandonResponsibilityForItem);

export default router;
