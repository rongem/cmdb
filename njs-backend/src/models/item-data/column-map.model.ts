import { targetIdField, targetTypeField } from '../../util/fields.constants';

export class ColumnMap {
    [targetIdField]!: string;
    [targetTypeField]!: string;
}
