import { Guid } from 'guid-typescript';

export class Connection {
    ConnId: Guid;
    ConnType: Guid;
    ConnUpperItem: Guid;
    ConnLowerItem: Guid;
    RuleId: Guid;
    Description: string;
}
