import { IRestAttributeGroup } from './attribute-group.model';

export interface IRestItemType {
    id: string;
    name: string;
    backColor: string;
    attributeGroups?: IRestAttributeGroup[];
}
