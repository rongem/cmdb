import { createAction, props } from '@ngrx/store';
import { LineMessage } from '../../objects/item-data/line-message.model';

export const clearLog = createAction('[Log] Clear log');

export const log = createAction('[Log] Create log entry',
    props<{ logEntry: LineMessage }>()
);

