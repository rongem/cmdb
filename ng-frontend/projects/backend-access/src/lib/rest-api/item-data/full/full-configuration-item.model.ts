import { RestFullAttribute } from './full-attribute.model';
import { RestFullConnection } from './full-connection.model';
import { RestFullLink } from './full-link.model';
import { RestFullResponsibility } from './full-responsibility.model';

export class RestFullConfigurationItem {
    id: string;
    type: string;
    typeId: string;
    name: string;
    color: string;
    lastChange: string;
    version: number;
    userIsResponsible: boolean;
    attributes: RestFullAttribute[];
    connectionsToUpper: RestFullConnection[];
    connectionsToLower: RestFullConnection[];
    links: RestFullLink[];
    responsibilities: RestFullResponsibility[];
}
