import { Guid } from 'guid-typescript';

interface ConfigItem {
    ItemId: Guid;
    ItemItype: Guid;
    TypeName: string;
    ItemName: string;
    ItemLastChange: Date;
    ItemVersion: number;
    ResponsibleUsers: string[];
}

export class ConfigurationItem {
    itemId: Guid;
    itemType: Guid;
    typeName: string;
    itemName: string;
    itemLastChange: Date;
    itemVersion: number;
    responsibleUsers: string[];

    constructor(configItem?: ConfigItem) {
        if (configItem) {
            this.itemId = configItem.ItemId;
            this.itemType = configItem.ItemItype;
            this.typeName = configItem.TypeName;
            this.itemName = configItem.TypeName;
            this.itemLastChange = configItem.ItemLastChange;
            this.itemVersion = configItem.ItemVersion;
            this.responsibleUsers = configItem.ResponsibleUsers;
        }
    }
}