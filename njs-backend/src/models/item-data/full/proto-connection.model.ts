import { typeIdField, targetIdField, ruleIdField, descriptionField } from '../../../util/fields.constants';

export class ProtoConnection {
    [typeIdField]?: string;
    [targetIdField]: string;
    [ruleIdField]: string;
    [descriptionField]: string;
}
