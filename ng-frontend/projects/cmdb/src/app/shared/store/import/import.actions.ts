import { createAction, props } from '@ngrx/store';

export const setImportItemType = createAction('[Import] Set item type for Import',
    props<{ itemTypeId: string }>()
);

export const setElements = createAction('[Import] Set elements to import',
    props<{ elements: string[] }>()
);
