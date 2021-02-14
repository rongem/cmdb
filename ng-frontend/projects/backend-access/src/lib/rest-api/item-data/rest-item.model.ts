import { IRestAttribute } from './rest-attribute.model';
import { IRestLink } from './rest-link.model';

export interface IRestItem {
    id: string;
    typeId: string;
    type?: string;
    color?: string;
    name: string;
    lastChange?: Date;
    version?: number;
    attributes?: IRestAttribute[];
    links?: IRestLink[];
    responsibleUsers?: string[];
}
