import { createAction, props } from '@ngrx/store';
import { ImportSettings } from '../../objects/import-settings.model';

export const setState = createAction('[Import] Set options for import',
    props<ImportSettings>()
);
