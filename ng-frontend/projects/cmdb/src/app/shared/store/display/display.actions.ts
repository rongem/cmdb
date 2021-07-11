import { createAction, props } from '@ngrx/store';
// import { ItemType } from 'backend-access';

import { VisibleComponent } from './visible-component.enum';
// import { GraphItem } from '../../objects/graph-item.model';

export const setVisibilityState = createAction('[Display] Set visibility of the search panel',
    props<{ visibilityState: VisibleComponent }>());

