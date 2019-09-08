import { Guid } from 'src/app/shared/guid';

export class ConnectionRule {
    RuleId: Guid;
    ItemUpperType: Guid;
    ConnType: Guid;
    ItemLowerType: Guid;
    MaxConnectionsToUpper: number;
    MaxConnectionsToLower: number;
}
