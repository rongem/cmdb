import express, { Request } from 'express';
import { body, param } from 'express-validator';
import multer, { FileFilterCallback} from 'multer';
import path from 'path';

import { validate } from '../validators';
import { isEditor } from '../../controllers/auth/authentication.controller';
import {
    captionField,
    columnsField,
    idField,
    itemTypeIdField,
    nameField,
    numberField,
    rowsField,
    workbookField,
} from '../../util/fields.constants';
import { importTable, uploadFile } from '../../controllers/item-data/import.controller';
import { invalidCaptionField, invalidColumnsArray, invalidFileTypeMsg, invalidItemTypeMsg, invalidNameMsg, invalidNumberMsg, invalidRowsMsg } from '../../util/messages.constants';
import { HttpError } from '../../rest-api/httpError.model';
import { itemTypeModel } from '../../models/mongoose/item-type.model';

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
    callback(new HttpError(422, invalidFileTypeMsg, {mimetype, extension}));
};

// upload as form-data with key workbook
const upload = multer({storage, fileFilter});
router.post('/ConvertFileToTable', upload.single(workbookField), uploadFile);

router.put('/DataTable', [
    body(itemTypeIdField, invalidItemTypeMsg).trim().isMongoId().bail().custom(itemTypeModel.validateIdExists),
    body(columnsField, invalidColumnsArray).isArray().bail().toArray().isLength({min: 1}),
    body(`${columnsField}.*.${numberField}`, invalidNumberMsg).isInt({min: 0}),
    body(`${columnsField}.*.${nameField}`, invalidNameMsg).isString().bail().trim().isLength({min: 1}),
    body(`${columnsField}.*.${captionField}`, invalidCaptionField).isString().bail().trim().isLength({min: 1}),
    body(rowsField, invalidRowsMsg).isArray().bail().toArray().isLength({min: 1}),
    body(`${rowsField}.*`).custom((value, {req}) => Array.isArray(value) && value.length === req.body[columnsField].length),
    body(`${rowsField}.*.*`).isString(),
], isEditor, validate, importTable);

export default router;
