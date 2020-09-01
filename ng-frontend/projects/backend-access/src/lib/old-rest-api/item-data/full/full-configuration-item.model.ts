import { RestFullAttribute } from './full-attribute.model';
import { OldRestFullConnection } from './full-connection.model';
import { RestFullLink } from './full-link.model';
import { RestFullResponsibility } from './full-responsibility.model';

export class OldRestFullConfigurationItem {
    id: string;
    type: string;
    typeId: string;
    name: string;
    color: string;
    lastChange: number;
    version: number;
    userIsResponsible: boolean;
    attributes: RestFullAttribute[];
    connectionsToUpper: OldRestFullConnection[];
    connectionsToLower: OldRestFullConnection[];
    links: RestFullLink[];
    responsibilities: RestFullResponsibility[];
}
