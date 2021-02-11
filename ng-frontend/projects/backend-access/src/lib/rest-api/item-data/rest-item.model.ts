import { RestAttribute } from './rest-attribute.model';
import { RestLink } from './rest-link.model';

export class RestItem {
    id: string;
    typeId: string;
    type?: string;
    color?: string;
    name: string;
    lastChange?: Date;
    version?: number;
    attributes?: RestAttribute[];
    links?: RestLink[];
    responsibleUsers?: string[];
}
