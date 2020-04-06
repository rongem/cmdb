import { createAction, props } from '@ngrx/store';
import { Guid } from 'backend-access';

export const setImportItemType = createAction('[Import] Set item type for Import',
    props<{ itemTypeId: Guid }>()
);

export const setElements = createAction('[Import] Set elements to import',
    props<{ elements: string[] }>()
);
