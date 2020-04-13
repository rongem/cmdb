import { createAction, props } from '@ngrx/store';

import { MetaData } from '../../objects/meta-data/meta-data.model';

export const setState = createAction('[MetaData] Set the whole state initially',
    props<{metaData: MetaData}>());

export const readState = createAction('[MetaData] Read the whole state from REST service');

export const invalidate = createAction('[MetaData] Read failed, state is invalid');
