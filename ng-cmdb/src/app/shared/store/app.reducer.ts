import * as fromMetaData from './meta-data.reducer';
import * as fromConfigurationItem from 'src/app/display/configuration-item/store/configuration-item.reducer';
import * as fromSearch from 'src/app/display/search/store/search.reducer';
import { ActionReducerMap } from '@ngrx/store';

export const METADATA = 'metaData';
export const CONFIGITEM = 'configurationItem';
export const SEARCH = 'search';

export interface AppState {
    metaData: fromMetaData.MetaState;
    configurationItem: fromConfigurationItem.ConfigItemState;
    search: fromSearch.SearchState;
}

export const appReducer: ActionReducerMap<AppState> = {
    metaData: fromMetaData.MetaDataReducer,
    configurationItem: fromConfigurationItem.ConfigurationItemReducer,
    search: fromSearch.SearchReducer,
}
