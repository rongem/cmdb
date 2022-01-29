import express, { Request } from 'express';
import { body } from 'express-validator';
import multer, { FileFilterCallback} from 'multer';
import path from 'path';

import { validate } from '../validators';
import { isEditor } from '../../controllers/auth/authentication.controller';
import {
    columnsField,
    itemTypeIdField,
    rowsField,
    targetIdField,
    targetTypeField,
    workbookField,
} from '../../util/fields.constants';
import { importTable, uploadFile } from '../../controllers/item-data/import.controller';
import {
    deviatingArrayLengthMsg,
    disallowedAttributeTypeMsg,
    disallowedConnectionRuleMsg,
    invalidColumnsArray,
    invalidFileTypeMsg,
    invalidItemTypeMsg,
    invalidMultipleLinksMsg,
    invalidRowsMsg,
    invalidTargetIdMsg,
    invalidTargetIdWithNameMsg,
    invalidTargetTypeMsg,
    missingTargetIdMsg,
    missingTargetTypeMsg,
    notAStringValueMsg,
} from '../../util/messages.constants';
import { HttpError } from '../../rest-api/httpError.model';
import { targetTypeValues } from '../../util/values.constants';
import { attributeTypeModelGetAttributeTypesForItemType } from '../../models/abstraction-layer/meta-data/attribute-type.al';
import { AttributeType } from '../../models/meta-data/attribute-type.model';
import { connectionRuleModelFind } from '../../models/abstraction-layer/meta-data/connection-rule.al';
import { ConnectionRule } from '../../models/meta-data/connection-rule.model';
import { itemTypeModelFindSingle } from '../../models/abstraction-layer/meta-data/item-type.al';

const router = express.Router();

// keep file in memory rather than store it on disk
const storage = multer.memoryStorage();

// File import handler
const fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
    const mimetype = file.mimetype.toLowerCase();
    const extension = path.extname(file.originalname).toLocaleLowerCase();
    const allowedMimeTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/comma-separated-value',
        'text/csv',
    ];
    const allowedExtensions = ['.csv', '.xlsx'];
    if ((allowedExtensions.includes(extension) && allowedMimeTypes.includes(mimetype))) {
        callback(null, true);
        return;
    }
    // special for csv file being declared as excel
    if ((mimetype === 'application/vnd.ms-excel' && extension === '.csv')) {
        callback(null, true);
        return;
    }
    callback(new HttpError(400, invalidFileTypeMsg, {mimetype, extension}));
};

// upload as form-data with key workbook
const upload = multer({storage, fileFilter});
router.post('/ConvertFileToTable', upload.single(workbookField), uploadFile);

const targetTypesWithoutId = [targetTypeValues[0], targetTypeValues[4], targetTypeValues[5]];

router.put('/DataTable', [
    body(itemTypeIdField, invalidItemTypeMsg).trim().isMongoId().bail()
        .custom((id, {req}) => itemTypeModelFindSingle(id).then(itemType => {
            if (!itemType) {
                return Promise.reject();
            }
            req.itemType = itemType;
            return Promise.resolve();
        })),
    body(columnsField, invalidColumnsArray).isArray().bail().toArray().isLength({min: 1}).bail()
        // name must be present and unique
        .custom(value => value.filter((v: any) => typeof v[targetTypeField] === 'string' &&
            v[targetTypeField]?.toLocaleLowerCase() === targetTypeValues[0]).length === 1)
        .withMessage(missingTargetTypeMsg)
        // attribute types must be valid and allowed for the given item type
        .custom(async (value, {req}) => {
            if (!req.itemType) {
                return Promise.reject();
            }
            const attributeTypeIds: string[] = value.filter((v: any) => typeof v[targetTypeField] === 'string' &&
                v[targetTypeField]?.toLocaleLowerCase() === targetTypeValues[1]).map((v: any) => v[targetIdField]);
            if (attributeTypeIds.length === 0) {
                req.attributeTypes = [];
                return Promise.resolve();
            }
            req.attributeTypes = await attributeTypeModelGetAttributeTypesForItemType(req.itemType.id);
            const allowedAttributeTypeIds: string[] = req.attributeTypes.map((a: AttributeType) => a.id);
            if (attributeTypeIds.some(a => !allowedAttributeTypeIds.includes(a))) {
                return Promise.reject();
            }
            return Promise.resolve();
        })
        .withMessage(disallowedAttributeTypeMsg)
        // connection rule ids must be valid and allowed for the given item type
        .custom(async (value, {req}) => {
            if (!req.itemType) {
                return Promise.reject();
            }
            const ruleIds: string[] = value.filter((v: any) => typeof v[targetTypeField] === 'string' &&
                (v[targetTypeField]?.toLocaleLowerCase() === targetTypeValues[2] ||
                v[targetTypeField]?.toLocaleLowerCase() === targetTypeValues[3])).map((v: any) => v[targetIdField]);
            if (ruleIds.length === 0) {
                req.connectionRules = [];
                return Promise.resolve();
            }
            req.connectionRules = await connectionRuleModelFind({$or: [{upperItemType: req.itemType.id}, {lowerItemType: req.itemType.id}]});
            const allowedRuleIds: string[] = req.connectionRules.map((r: ConnectionRule) => r.id);
            if (ruleIds.some(r => !allowedRuleIds.includes(r))) {
                return Promise.reject();
            }
            return Promise.resolve();
        })
        .withMessage(disallowedConnectionRuleMsg)
        // link address may be present only once
        .custom(value => value.filter((v: any) => typeof v[targetTypeField] === 'string' &&
            v[targetTypeField]?.toLocaleLowerCase() === targetTypeValues[5]).length <= 1)
        .withMessage(invalidMultipleLinksMsg)
        // link description without link address makes no sense, so check this
        .custom(value => value.filter((v: any) => typeof v[targetTypeField] === 'string' &&
            v[targetTypeField]?.toLocaleLowerCase() === targetTypeValues[4]).length <=
            value.filter((v: any) => typeof v[targetTypeField] === 'string' &&
            v[targetTypeField]?.toLocaleLowerCase() === targetTypeValues[5]).length)
        .withMessage(invalidMultipleLinksMsg),
    body(`${columnsField}.*.${targetIdField}`, invalidTargetIdMsg).optional().isMongoId(),
    body(`${columnsField}.*.${targetTypeField}`, invalidTargetTypeMsg).isString().bail().trim().toLowerCase()
        .custom(value => targetTypeValues.includes(value)),
    // target id is only needed for attributes and connections, not for name or link
    body(`${columnsField}.*`)
        .custom(value => typeof value[targetTypeField] === 'string' && (!targetTypesWithoutId.includes(value[targetTypeField]) ||
            (targetTypesWithoutId.includes(value[targetTypeField]) && !value[targetIdField])))
        .withMessage(invalidTargetIdWithNameMsg).bail()
        .custom(value => typeof value[targetTypeField] === 'string' && (targetTypesWithoutId.includes(value[targetTypeField]) ||
            (!targetTypesWithoutId.includes(value[targetTypeField]) && value[targetIdField])))
        .withMessage(missingTargetIdMsg),
    body(rowsField, invalidRowsMsg).isArray().bail().toArray().isLength({min: 1}),
    body(`${rowsField}.*`, deviatingArrayLengthMsg).custom((value, {req}) => Array.isArray(value) && value.length === req.body[columnsField].length),
    body(`${rowsField}.*.*`, notAStringValueMsg).isString().trim(),
], isEditor, validate, importTable);

export default router;
