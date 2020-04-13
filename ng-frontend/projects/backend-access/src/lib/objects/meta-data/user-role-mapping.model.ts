import { UserRole } from './user-role.enum';

export class UserRoleMapping {
    constructor(public username: string,
                public isGroup: boolean,
                public role: UserRole) {}
}
