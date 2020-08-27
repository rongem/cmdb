import { RestAttribute } from './attribute.model';
import { RestLink } from './link.model';

export class RestItem {
    id: string;
    typeId: string;
    type?: string;
    name: string;
    lastChange?: Date;
    version?: number;
    attributes?: RestAttribute[];
    links?: RestLink[];
    responsibleUsers?: string[];
}
