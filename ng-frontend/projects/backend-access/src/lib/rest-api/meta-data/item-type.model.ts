import { RestAttributeGroup } from './attribute-group.model';

export class RestItemType {
    id: string;
    name: string;
    backColor: string;
    attributeGroups?: RestAttributeGroup[];
}
