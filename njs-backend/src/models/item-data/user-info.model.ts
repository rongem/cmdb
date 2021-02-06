import { roleNamesValues } from '../../util/values.constants';
import { IUser } from '../mongoose/user.model';

export class UserInfo {
    accountName!: string;
    role!: number;
    roleName!: string;
    // displayName!: string;
    // mail!: string;
    // phone!: string;
    // office!: string;

    constructor(u?: IUser) {
        if (u) {
            this.accountName = u.name;
            this.role = u.role;
            this.roleName = roleNamesValues[u.role];
        }
    }
}
