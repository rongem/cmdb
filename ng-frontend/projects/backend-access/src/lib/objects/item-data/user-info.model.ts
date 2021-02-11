import { RestUserInfo } from '../../rest-api/item-data/rest-user-info.model';
import { UserRole } from '../meta-data/user-role.enum';

export class UserInfo {
    accountName: string;
    role: UserRole;
    roleName: string;
    // displayName: string;
    // mail: string;
    // phone: string;
    // office: string;

    constructor(info?: RestUserInfo) {
        if (info) {
            this.accountName = info.accountName;
            this.role = info.role;
            this.roleName = info.roleName;
            // this.displayName = info.displayName;
            // this.mail = info.Mail;
            // this.phone = info.Phone;
            // this.office = info.Office;
        }
    }
}
