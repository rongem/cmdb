import { FullConfigurationItem } from 'backend-access';

export class GraphItem {
    level: number;
    private item: FullConfigurationItem;
    constructor(item: FullConfigurationItem, level: number) {
        this.level = level;
        this.item = item;
    }
    get id() { return this.item.id; }
    get type() { return this.item.type; }
    get name() { return this.item.name; }
    get color() { return this.item.color; }
    get itemIdsAbove() { return this.item.connectionsToUpper.map(conn => conn.targetId); }
    get itemIdsBelow() { return this.item.connectionsToLower.map(conn => conn.targetId); }
    get attributes() { return this.item.attributes.map(att => att.type + ': ' + att.value); }
    get attributesLength() { return this.item.attributes.length; }
}
