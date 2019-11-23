import { createAction, props } from '@ngrx/store';
import { Guid } from 'src/app/shared/guid';

export const setImportItemType = createAction('[Import] Set item type for Import',
    props<{ itemTypeId: Guid }>());
