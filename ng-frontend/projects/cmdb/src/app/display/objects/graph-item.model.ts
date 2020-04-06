import { FullConfigurationItem } from 'projects/cmdb/src/app/shared/objects/full-configuration-item.model';

export class GraphItem {
    constructor(item: FullConfigurationItem, level: number) {
        this.level = level;
        this.item = item;
    }
    private item: FullConfigurationItem;
    get id() { return this.item.id; }
    get type() { return this.item.type; }
    get name() { return this.item.name; }
    get color() { return this.item.color; }
    get itemIdsAbove() { return this.item.connectionsToUpper.map(conn => conn.targetId); }
    get itemIdsBelow() { return this.item.connectionsToLower.map(conn => conn.targetId); }
    get attributes() { return this.item.attributes.map(att => att.type + ': ' + att.value); }
    get attributesLength() { return this.item.attributes.length; }
    level: number;
}
