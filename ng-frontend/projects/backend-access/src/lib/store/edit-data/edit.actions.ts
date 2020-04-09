import { createAction, props } from '@ngrx/store';
import { ConfigurationItem } from '../../rest-api/item-data/configuration-item.model';
import { Guid } from '../../guid';
import { ItemAttribute } from '../../rest-api/item-data/item-attribute.model';
import { Connection } from '../../rest-api/item-data/connection.model';
import { ItemLink } from '../../rest-api/item-data/item-link.model';

export const createConfigurationItem = createAction('[Edit] Create configuration item',
    props<{ configurationItem: ConfigurationItem }>()
);

export const updateConfigurationItem = createAction('[Edit] Update configuration item',
    props<{ configurationItem: ConfigurationItem }>()
);

export const deleteConfigurationItem = createAction('[Edit] Delete configuration item',
    props<{ itemId: Guid }>()
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
    props<{ connection: Connection, itemId: Guid }>()
);

export const updateConnection = createAction('[Edit] Update connection',
    props<{ connection: Connection, itemId: Guid }>()
);

export const deleteConnection = createAction('[Edit] Delete connection',
    props<{ connId: Guid, itemId: Guid }>()
);

export const takeResponsibility = createAction('[Edit] Take responsibility for item',
    props<{ itemId: Guid }>()
);

export const abandonResponsibility = createAction('[Edit] Abandon responsibility for item',
    props<{ itemId: Guid }>()
);

export const deleteInvalidResponsibility = createAction('[Edit] Delete invalid responsibility for item',
    props<{ itemId: Guid, userToken: string }>()
);

export const createLink = createAction('[Edit] Create external link for item',
    props<{ itemLink: ItemLink }>()
);

export const deleteLink = createAction('[Edit] Delete external link for item',
    props<{ itemLink: ItemLink }>()
);
