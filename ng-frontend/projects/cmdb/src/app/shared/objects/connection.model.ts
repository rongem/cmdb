import { Guid } from 'backend-access';

export class Connection {
    ConnId: Guid;
    ConnType: Guid;
    // ConnTypeName: string;
    // ConnTypeReverseName: string;
    ConnUpperItem: Guid;
    ConnLowerItem: Guid;
    RuleId: Guid;
    Description: string;
}
