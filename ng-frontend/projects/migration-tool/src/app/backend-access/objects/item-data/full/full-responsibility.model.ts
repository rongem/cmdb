import { RestFullResponsibility } from '../../../old-rest-api/item-data/full/full-responsibility.model';

export class FullResponsibility {
    name: string;
    account: string;
    mail: string;
    phone: string;
    office: string;
    invalidAccount: boolean;

    constructor(responsibility?: RestFullResponsibility) {
        if (responsibility) {
            this.name = responsibility.name;
            this.account = responsibility.account;
            this.mail = responsibility.mail;
            this.phone = responsibility.phone;
            this.office = responsibility.office;
            this.invalidAccount = responsibility.invalidAccount;
        }
    }
}
