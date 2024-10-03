import { roleNamesValues } from '../../util/values.constants';
import { IUser } from '../mongoose/user.model';

export class UserAccount {
    id!: string;
    accountName!: string;
    role!: number;
    roleName!: string;
    // displayName!: string;
    // mail!: string;
    // phone!: string;
    // office!: string;

    constructor(u?: IUser) {
        if (u) {
            this.id = (u._id as any).toString();
            this.accountName = u.name;
            this.role = u.role;
            this.roleName = roleNamesValues[u.role];
        }
    }
}
