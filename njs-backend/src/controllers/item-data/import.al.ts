import { HttpError } from '../../rest-api/httpError.model';
import { noFileMsg } from '../../util/messages.constants';
import * as XLSX from 'xlsx';
import { IUser } from '../../models/mongoose/user.model';
import { ColumnMap } from '../../models/item-data/column-map.model';
import { targetTypeValues } from '../../util/values.constants';
import { configurationItemModelFindOne } from './configuration-item.al';
import { configurationItemModel, IConfigurationItem } from '../../models/mongoose/configuration-item.model';
import { typeField, attributesField, nameField, responsibleUsersField } from '../../util/fields.constants';
import { connectionModel } from '../../models/mongoose/connection.model';

interface SheetResult {
    fileName: string;
    fileType: string;
    sheets: Sheet[];
}

interface Sheet {
    name: string;
    lines: string[][];
}

export function handleFile(file: Express.Multer.File) {
    if (!file) {
        throw new HttpError(422, noFileMsg);
    }
    const wb = XLSX.read(file.buffer, {type: 'buffer'});
    const result: SheetResult = {
        fileName: file.originalname,
        fileType: file.mimetype,
        sheets: [],
    };
    wb.SheetNames.forEach(name => {
        const ws = wb.Sheets[name];
        const sheet: Sheet = {
            name,
            lines: XLSX.utils.sheet_to_json(ws, {blankrows: false, defval: '', rawNumbers: false, header: 1}),
        };
        result.sheets.push(sheet);
    });
    return result;
}

export async function importDataTable(type: string, columns: ColumnMap[], rows: string[][], authentication: IUser) {
    const nameColumnId = columns.findIndex(c => c.targetType === targetTypeValues[0]);
    const linkDescriptionId = columns.findIndex(c => c.targetType === targetTypeValues[4]);
    const itemPromises: Promise<IConfigurationItem | undefined>[] = [];
    let ruleIds: string[] = [];
    rows.forEach(row => {
        const itemName = row[nameColumnId];
        itemPromises.push(configurationItemModel.findOne({name: { $regex: '^' + itemName + '$', $options: 'i' }, type})
            .populate({ path: typeField })
            .populate({ path: `${attributesField}.${typeField}`, select: nameField })
            .populate({ path: responsibleUsersField, select: nameField }));
        columns.forEach(col => {
            if (col.targetType === targetTypeValues[2] || col.targetType === targetTypeValues[3]) {
                ruleIds.push(col.targetId);
            }
        });
    });
    ruleIds = [...new Set(ruleIds)];
    const configurationItems = await Promise.all(itemPromises);
    const existingItemIds = configurationItems.filter(i => !!i).map(i => i!._id);
    const connections = ruleIds.length > 0 ? await connectionModel.find({$and: [
        {$or: [{upperItem: {$in: existingItemIds}}, {lowerItem: {$in: existingItemIds}}]},
        {connectionRule: {$in: ruleIds}}
    ]}) : [];
    rows.forEach((row, index) => {
        const item = configurationItems[index];
        if (item) {} else {}
    });
}
