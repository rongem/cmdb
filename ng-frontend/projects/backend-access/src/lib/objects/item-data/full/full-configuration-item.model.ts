import { FullConnection } from './full-connection.model';
import { RestFullItem } from '../../../rest-api/item-data/full/rest-full-item.model';
import { ItemAttribute } from '../item-attribute.model';
import { ItemLink } from '../item-link.model';

export class FullConfigurationItem {
    id: string;
    type?: string;
    typeId: string;
    name: string;
    color?: string;
    lastChange?: Date;
    version?: number;
    userIsResponsible?: boolean;
    attributes?: ItemAttribute[];
    connectionsToUpper?: FullConnection[];
    connectionsToLower?: FullConnection[];
    links?: ItemLink[];
    responsibilities?: string[];

    constructor(item?: RestFullItem) {
        if (item) {
            this.id = item.id;
            this.type = item.type;
            this.typeId = item.typeId;
            this.name = item.name;
            this.color = item.color;
            this.lastChange = item.lastChange;
            this.version = item.version;
            this.attributes = item.attributes?.map(a => ({
                id: a.id,
                itemId: item.id,
                typeId: a.typeId,
                type: a.type,
                value: a.value,
            }));
            this.connectionsToUpper = item.connectionsToUpper?.map(c => new FullConnection(c));
            this.connectionsToLower = item.connectionsToLower?.map(c => new FullConnection(c));
            this.links = item.links?.map(l => ({
                id: l.id,
                uri: l.uri,
                itemId: item.id,
                description: l.description,
            }));
            this.responsibilities = item.responsibleUsers;
        }
    }
}
