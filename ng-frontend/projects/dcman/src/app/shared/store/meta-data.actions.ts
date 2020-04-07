import { createAction, props } from '@ngrx/store';

import { MetaData } from 'backend-access';
import { AttributeGroup } from 'backend-access';
import { ItemType } from 'backend-access';
import { AttributeType } from 'backend-access';
import { ConnectionType } from 'backend-access';
import { ConnectionRule } from 'backend-access';
import { ItemTypeAttributeGroupMapping } from 'backend-access';

export const setState = createAction('[MetaData] Set the whole state initially',
    props<{metaData: MetaData}>());

export const readState = createAction('[MetaData] Read the whole state from REST service',
    props<{resetRetryCount: boolean}>()
);

export const error = createAction('[MetaData] Read failed, state is invalid or other error occured',
    props<{error: string, invalidateData: boolean}>()
);

export const clearError = createAction('[MetaData] Error cleared');

export const validateSchema = createAction('[MetaData] Schema is valid');

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

export const changeConnectionRule = createAction('[MetaData] Change connection rule',
    props<{connectionRule: ConnectionRule}>()
);

export const createItemTypeAttributeGroupMapping = createAction('[MetaData] Create mapping',
    props<{mapping: ItemTypeAttributeGroupMapping}>()
);

export const noAction = createAction('[*] No Action');
