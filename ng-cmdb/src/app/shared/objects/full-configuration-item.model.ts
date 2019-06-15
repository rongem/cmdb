import { Guid } from 'guid-typescript';

class Attribute {
    id: Guid;
    type: string;
    typeId: Guid;
    value: string;
    lastChange: Date;
    version: number;
}

export class Connection {
    id; Guid;
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

class Link {
    id: Guid;
    uri: string;
    description: string;
}

class Responsibility {
    name: string;
    mail: string;
    phone: string;
    office: string;
}

export class FullConfigurationItem {
    id: Guid;
    type: string;
    name: string;
    color: string;
    lastChange: Date;
    version: number;
    attributes: Attribute[];
    connectionsToUpper: Connection[];
    connectionsToLower: Connection[];
    links: Link[];
    responsibilities: Responsibility[];
}
