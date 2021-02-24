export interface IRestUserInfo {
    accountName: string;
    role: number;
    roleName: string;
    // displayName: string;
    // mail: string;
    // phone: string;
    // office: string;
}

export interface IRestDeletedUser {
    deleted: boolean;
    user: IRestUserInfo;
}
