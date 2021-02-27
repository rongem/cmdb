import { createAction, props } from '@ngrx/store';
import { ConfigurationItem } from '../../objects/item-data/configuration-item.model';
import { Connection } from '../../objects/item-data/connection.model';
import { FullConfigurationItem } from '../../objects/item-data/full/full-configuration-item.model';

export const createFullConfigurationItem = createAction('[Edit] Create configuration item with all properties',
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

export const storeConfigurationItem = createAction('[Edit] Set configuration item in store',
    props<{ configurationItem: ConfigurationItem }>()
);

export const storeFullConfigurationItem = createAction('[Edit] Set full configuration item in store',
    props<{ configurationItem: FullConfigurationItem }>()
);

export const createConnection = createAction('[Edit] Create connection',
    props<{ connection: Connection }>()
);

export const updateConnection = createAction('[Edit] Update connection',
    props<{ connection: Connection }>()
);

export const deleteConnection = createAction('[Edit] Delete connection',
    props<{ connId: string }>()
);

export const storeConnection = createAction('[Edit] Set connection in store',
    props<{ connection: Connection}>()
);

export const unstoreConnection = createAction('[Edit] Remove connection from store',
    props<{ connection: Connection}>()
);

export const takeResponsibility = createAction('[Edit] Take responsibility for item',
    props<{ itemId: string }>()
);

export const abandonResponsibility = createAction('[Edit] Abandon responsibility for item',
    props<{ itemId: string }>()
);

