import * as fromMetaData from './meta-data.reducer';

export const METADATA = 'metaData';

export interface AppState {
    metaData: fromMetaData.MetaState;
}
