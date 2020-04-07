import { createAction, props } from '@ngrx/store';

import { ConfigurationItem } from 'backend-access';
import { FullConfigurationItem } from 'backend-access';
import { ItemAttribute } from 'backend-access';
import { Connection } from 'backend-access';

export const createItem = createAction('[Data] Create a new configuration item.',
    props<{item: FullConfigurationItem}>()
);

export const updateItem = createAction('[Data] Update an existing configuration item.',
    props<{item: ConfigurationItem}>()
);

export const deleteItem = createAction('[Data] Delete an existing configuration item.',
    props<{item: ConfigurationItem}>()
);

export const createAttribute = createAction('[Data] Create a new attribute.',
    props<{attribute: ItemAttribute}>()
);

export const updateAttribute = createAction('[Data] Update an existing attribute.',
    props<{attribute: ItemAttribute}>()
);

export const deleteAttribute = createAction('[Data] Delete an existing attribute.',
    props<{attribute: ItemAttribute}>()
);

export const createConnection = createAction('[Data] Create a new connection.',
    props<{connection: Connection}>()
);

export const updateConnection = createAction('[Data] Update an existing connection.',
    props<{connection: Connection}>()
);

export const deleteConnection = createAction('[Data] Delete an existing connection.',
    props<{connection: Connection}>()
);



