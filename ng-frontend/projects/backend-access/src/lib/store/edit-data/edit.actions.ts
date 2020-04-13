import { createAction, props } from '@ngrx/store';
import { ConfigurationItem } from '../../objects/item-data/configuration-item.model';
import { ItemAttribute } from '../../objects/item-data/item-attribute.model';
import { Connection } from '../../objects/item-data/connection.model';
import { ItemLink } from '../../objects/item-data/item-link.model';
import { FullConfigurationItem } from '../../objects/item-data/full/full-configuration-item.model';

export const createFullConfigurationItem = createAction('[Edit} Create configuration item with all properties',
    props<{ item: FullConfigurationItem}>()
);

export const createConfigurationItem = createAction('[Edit] Create configuration item',
    props<{ configurationItem: ConfigurationItem }>()
);

export const updateConfigurationItem = createAction('[Edit] Update configuration item',
    props<{ configurationItem: ConfigurationItem }>()
);

export const deleteConfigurationItem = createAction('[Edit] Delete configuration item',
    props<{ itemId: string }>()
);

export const createItemAttribute = createAction('[Edit] Create item attribute',
    props<{ itemAttribute: ItemAttribute }>()
);

export const updateItemAttribute = createAction('[Edit] Update item attribute',
    props<{ itemAttribute: ItemAttribute }>()
);

export const deleteItemAttribute = createAction('[Edit] Delete item attribute',
    props<{ itemAttribute: ItemAttribute }>()
);

export const createConnection = createAction('[Edit] Create connection',
    props<{ connection: Connection, itemId: string }>()
);

export const updateConnection = createAction('[Edit] Update connection',
    props<{ connection: Connection, itemId: string }>()
);

export const deleteConnection = createAction('[Edit] Delete connection',
    props<{ connId: string, itemId: string }>()
);

export const takeResponsibility = createAction('[Edit] Take responsibility for item',
    props<{ itemId: string }>()
);

export const abandonResponsibility = createAction('[Edit] Abandon responsibility for item',
    props<{ itemId: string }>()
);

export const deleteInvalidResponsibility = createAction('[Edit] Delete invalid responsibility for item',
    props<{ itemId: string, userToken: string }>()
);

export const createLink = createAction('[Edit] Create external link for item',
    props<{ itemLink: ItemLink }>()
);

export const deleteLink = createAction('[Edit] Delete external link for item',
    props<{ itemLink: ItemLink }>()
);
