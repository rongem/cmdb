import { Guid } from 'backend-access';
import { FullAttribute } from './full-attribute.model';
import { FullConnection } from './full-connection.model';
import { FullLink } from './full-link.model';
import { FullResponsibility } from './full-responsibility.model';

export class FullConfigurationItem {
    id: Guid;
    type: string;
    typeId: Guid;
    name: string;
    color: string;
    lastChange: Date;
    version: number;
    userIsResponsible: boolean;
    attributes: FullAttribute[];
    connectionsToUpper: FullConnection[];
    connectionsToLower: FullConnection[];
    links: FullLink[];
    responsibilities: FullResponsibility[];
}
