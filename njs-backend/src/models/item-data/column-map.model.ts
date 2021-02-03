import { captionField, numberField, targetIdField, targetTypeField } from '../../util/fields.constants';

export class ColumnMap {
    [numberField]!: number;
    [targetIdField]!: string;
    [targetTypeField]!: string;
    [captionField]!: string;
}
