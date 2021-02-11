import { RestLineMessage } from '../../rest-api/rest-line-message.model';

export class LineMessage {
    index?: number;
    message: string;
    subject?: string;
    details?: string;
    severity?: number;

    constructor(message?: RestLineMessage) {
        if (message) {
            this.index = message.index;
            this.message = message.message;
            this.subject = message.subject;
            this.details = message.details;
            this.severity = message.severity;
        }
    }
}
