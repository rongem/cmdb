import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { MetaData } from 'backend-access';

export const setState = createAction('[MetaData] Set the whole state initially',
    props<{metaData: MetaData}>());

export const readState = createAction('[MetaData] Read the whole state from REST service');

export const error = createAction('[MetaData] Read failed, state is invalid',
    props<{error: HttpErrorResponse, invalidateData: boolean}>());
