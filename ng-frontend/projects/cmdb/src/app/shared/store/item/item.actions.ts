import { createAction, props } from '@ngrx/store';
import { ItemType } from 'backend-access';

import { GraphItem } from '../../objects/graph-item.model';

export const filterResultsByItemType = createAction('[Display/Results] Filter result lists by item type',
    props<{ itemType: ItemType}>());

export const readGraphItem = createAction('[Display/Graph] Read graph item',
    props<{ id: string; level: number }>());

export const addGraphItem = createAction('[Display/Graph] Add graph item to array',
    props<{ item: GraphItem}>());

export const addProcessedItemId = createAction('[Display/Graph] Add id of item that is being processed',
    props<{ id: string }>());
