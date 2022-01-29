import { createAction, props } from '@ngrx/store';

export const setUrl = createAction('[Global] Set the url the user wants to navigate to before being logged in',
    props<{ url: string }>()
);

export const clearUrl = createAction('[Global] Clear the url the user wants to navigate to before being logged in');
