import { FullAttribute } from './full-attribute.model';
import { FullConnection } from './full-connection.model';
import { FullLink } from './full-link.model';
import { FullResponsibility } from './full-responsibility.model';
import { RestFullConfigurationItem } from '../../../rest-api/item-data/full-configuration-item.model';
import { OldRestFullConfigurationItem } from '../../../old-rest-api/item-data/full/full-configuration-item.model';
import { Guid } from '../../../guid';
import { ItemAttribute } from '../item-attribute.model';

export class FullConfigurationItem {
    id: string;
    type?: string;
    typeId: string;
    name: string;
    color?: string;
    lastChange?: Date;
    version?: number;
    userIsResponsible?: boolean;
    attributes?: FullAttribute[];
    connectionsToUpper?: FullConnection[];
    connectionsToLower?: FullConnection[];
    links?: FullLink[];
    responsibilities?: FullResponsibility[];

    constructor(item?: OldRestFullConfigurationItem | RestFullConfigurationItem) {
        if (item) {
            if (Guid.isGuid(item.id)) {
                item = item as OldRestFullConfigurationItem;
                this.id = Guid.parse(item.id).toString();
                this.type = item.type;
                this.typeId = Guid.parse(item.typeId).toString();
                this.name = item.name;
                this.color = item.color;
                this.lastChange = new Date(+item.lastChange / 10000);
                this.version = item.version;
                this.userIsResponsible = item.userIsResponsible;
                this.attributes = item.attributes?.map(a => new FullAttribute(a));
                this.connectionsToUpper = item.connectionsToUpper?.map(c => new FullConnection(c));
                this.connectionsToLower = item.connectionsToLower?.map(c => new FullConnection(c));
                this.links = item.links?.map(l => new FullLink(l));
                this.responsibilities = item.responsibilities?.map(r => new FullResponsibility(r));
            } else {
                item = item as RestFullConfigurationItem;
                this.id = item.id;
                this.type = item.type;
                this.typeId = item.typeId;
                this.name = item.name;
                // this.color = item.color;
                this.lastChange = item.lastChange;
                this.version = item.version;
                this.attributes = item.attributes?.map(a => ({
                    id: a.id,
                    typeId: a.typeId,
                    type: a.type,
                    value: a.value,
                }));
                this.connectionsToUpper = item.connectionsToUpper?.map(c => new FullConnection(c));
                this.connectionsToLower = item.connectionsToLower?.map(c => new FullConnection(c));
                this.links = item.links?.map(l => ({
                    id: l.id,
                    uri: l.uri,
                    description: l.description,
                }));
                this.responsibilities = item.responsibleUsers?.map(u => ({
                    account: u,
                    invalidAccount: false,
                    mail: '',
                    name: u,
                    office: '',
                    phone: '',
                }));
            }
        }
    }
}
