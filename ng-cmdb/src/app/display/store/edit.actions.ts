import { createAction, props } from '@ngrx/store';
import { ConfigurationItem } from 'src/app/shared/objects/configuration-item.model';
import { ItemAttribute } from 'src/app/shared/objects/item-attribute.model';
import { Connection } from 'src/app/shared/objects/connection.model';
import { Guid } from 'src/app/shared/guid';

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
    props<{ Connection: Connection, itemId: Guid }>()
);

export const updateConnection = createAction('[Display/ConfigurationItem/Edit] Update connection',
    props<{ Connection: Connection, itemId: Guid }>()
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
