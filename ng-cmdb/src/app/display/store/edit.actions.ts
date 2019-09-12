import { createAction, props } from '@ngrx/store';
import { ConfigurationItem } from 'src/app/shared/objects/configuration-item.model';

export const createConfigurationItem = createAction('[Display/ConfigurationItem/Edit] Create configuration item',
    props<{ configurationItem: ConfigurationItem}>()
);

export const updateConfigurationItem = createAction('[Display/ConfigurationItem/Edit] Update configuration item',
    props<{ configurationItem: ConfigurationItem}>()
);

export const deleteConfigurationItem = createAction('[Display/ConfigurationItem/Edit] Delete configuration item',
props<{ configurationItem: ConfigurationItem}>()
);
