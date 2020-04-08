import { createAction, props } from '@ngrx/store';

export const error = createAction('[Error] Error occured',
    props<{error: any, fatal: boolean}>()
);

export const clearError = createAction('[Error] Error cleared');

