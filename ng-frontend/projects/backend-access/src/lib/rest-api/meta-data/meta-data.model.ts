import { IRestAttributeGroup } from './attribute-group.model';
import { IRestAttributeType } from './attribute-type.model';
import { IRestConnectionRule } from './connection-rule.model';
import { IRestConnectionType } from './connection-type.model';
import { IRestItemType } from './item-type.model';
import { IRestItemTypeAttributeGroupMapping } from './item-type-attribute-group-mapping.model';

export interface IRestMetaData {
    attributeGroups: IRestAttributeGroup[];
    attributeTypes: IRestAttributeType[];
    itemTypeAttributeGroupMappings: IRestItemTypeAttributeGroupMapping[];
    connectionRules: IRestConnectionRule[];
    connectionTypes: IRestConnectionType[];
    itemTypes: IRestItemType[];
    userName: string;
    userRole: number;
}
