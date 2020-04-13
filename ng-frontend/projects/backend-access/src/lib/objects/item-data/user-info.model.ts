import { RestUserInfo } from '../../rest-api/item-data/user-info.model';

export class UserInfo {
    displayName: string;
    accountName: string;
    mail: string;
    phone: string;
    office: string;

    constructor(info?: RestUserInfo) {
        if (info) {
            this.displayName = info.DisplayName;
            this.accountName = info.AccountName;
            this.mail = info.Mail;
            this.phone = info.Phone;
            this.office = info.Office;
        }
    }
}
