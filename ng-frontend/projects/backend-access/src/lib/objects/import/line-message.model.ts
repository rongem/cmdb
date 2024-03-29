import { IRestLineMessage } from '../../rest-api/rest-line-message.model';

export class LineMessage {
    index?: number;
    message: string;
    subject?: string;
    subjectId?: string;
    attributeTypeId?: string;
    connectionRuleId?: string;
    details?: string;
    severity?: number;

    constructor(message?: IRestLineMessage) {
        if (message) {
            this.index = message.index;
            this.message = message.message;
            this.subject = message.subject;
            this.details = message.details;
            this.severity = message.severity;
        }
    }
}
