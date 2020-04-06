import { Guid } from '../../guid';

export class FullConnection {
    id: Guid;
    typeId: Guid;
    connectionType: string;
    ruleId: Guid;
    targetId: Guid;
    targetType: string;
    targetTypeId: Guid;
    targetName: string;
    targetColor: string;
    description: string;
}
