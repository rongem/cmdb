import { createAction, props } from '@ngrx/store';
import { ConfigurationItem } from 'projects/cmdb/src/app/shared/objects/configuration-item.model';
import { ItemAttribute } from 'projects/cmdb/src/app/shared/objects/item-attribute.model';
import { Connection } from 'projects/cmdb/src/app/shared/objects/connection.model';
import { Guid } from 'backend-access';
import { ItemLink } from 'projects/cmdb/src/app/shared/objects/item-link.model';

export const createConfigurationItem = createAction('[Display/ConfigurationItem/Edit] Create configuration item',
    props<{ configurationItem: ConfigurationItem }>()
);

export const updateConfigurationItem = createAction('[Display/ConfigurationItem/Edit] Update configuration item',
    props<{ configurationItem: ConfigurationItem }>()
);

export const deleteConfigurationItem = createAction('[Display/ConfigurationItem/Edit] Delete configuration item',
    props<{ itemId: Guid }>()
);

export const createItemAttribute = createAction('[Display/ConfigurationItem/Edit] Create item attribute',
    props<{ itemAttribute: ItemAttribute }>()
);

export const updateItemAttribute = createAction('[Display/ConfigurationItem/Edit] Update item attribute',
    props<{ itemAttribute: ItemAttribute }>()
);

export const deleteItemAttribute = createAction('[Display/ConfigurationItem/Edit] Delete item attribute',
    props<{ itemAttribute: ItemAttribute }>()
);

export const createConnection = createAction('[Display/ConfigurationItem/Edit] Create connection',
    props<{ connection: Connection, itemId: Guid }>()
);

export const updateConnection = createAction('[Display/ConfigurationItem/Edit] Update connection',
    props<{ connection: Connection, itemId: Guid }>()
);

export const deleteConnection = createAction('[Display/ConfigurationItem/Edit] Delete connection',
    props<{ connId: Guid, itemId: Guid }>()
);

export const takeResponsibility = createAction('[Display/ConfigurationItem/Edit] Take responsibility for item',
    props<{ itemId: Guid }>()
);

export const abandonResponsibility = createAction('[Display/ConfigurationItem/Edit] Abandon responsibility for item',
    props<{ itemId: Guid }>()
);

export const deleteInvalidResponsibility = createAction('[Display/ConfigurationItem/Edit] Delete invalid responsibility for item',
    props<{ itemId: Guid, userToken: string }>()
);

export const createLink = createAction('[Display/ConfigurationItem/Edit] Create external link for item',
    props<{ itemLink: ItemLink }>()
);

export const deleteLink = createAction('[Display/ConfigurationItem/Edit] Delete external link for item',
    props<{ itemLink: ItemLink }>()
);