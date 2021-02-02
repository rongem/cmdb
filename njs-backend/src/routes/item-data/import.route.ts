import express, { Request } from 'express';
import { body, param } from 'express-validator';
import multer, { FileFilterCallback} from 'multer';
import path from 'path';

import { namedObjectUpdateValidators, idParamValidator } from '../validators';
import { isEditor } from '../../controllers/auth/authentication.controller';
import {
    idField, workbookField,
} from '../../util/fields.constants';
import { uploadFile } from '../../controllers/item-data/import.controller';
import { invalidFileTypeMsg } from '../../util/messages.constants';
import { HttpError } from '../../rest-api/httpError.model';

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

// router.post('/ConvertFileToTable', upload, uploadFile);
router.post('/ImportDataTable');

export default router;
