import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

import { MetaData } from '../objects/source/meta-data.model';
import { AttributeGroup } from '../objects/source/attribute-group.model';
import { ItemType } from '../objects/source/item-type.model';
import { AttributeType } from '../objects/source/attribute-type.model';
import { ConnectionType } from '../objects/source/connection-type.model';
import { ConnectionRule } from '../objects/source/connection-rule.model';
import { ItemTypeAttributeGroupMapping } from '../objects/source/item-type-attribute-group-mapping.model';

export const setState = createAction('[MetaData] Set the whole state initially',
    props<{metaData: MetaData}>());

export const readState = createAction('[MetaData] Read the whole state from REST service');

export const error = createAction('[MetaData] Read failed, state is invalid',
    props<{error: HttpErrorResponse, invalidateData: boolean}>()
);

export const createAttributeGroup = createAction('[MetaData] Create attribute group',
    props<{attributeGroup: AttributeGroup}>()
);
export const createAttributeType = createAction('[MetaData] Create attribute type',
    props<{attributeType: AttributeType}>()
);
export const createItemType = createAction('[MetaData] Create item type',
    props<{itemType: ItemType}>()
);
export const createConnectionType = createAction('[MetaData] Create connection type',
    props<{connectionType: ConnectionType}>()
);
export const createConnectionRule = createAction('[MetaData] Create connection rule',
    props<{connectionRule: ConnectionRule}>()
);

export const createItemTypeAttributeGroupMapping = createAction('[MetaData] Create mapping',
    props<{mapping: ItemTypeAttributeGroupMapping}>()
);
