import { ActionReducerMap } from '@ngrx/store';

import * as fromMetaData from './meta-data.reducer';
import * as fromConfigurationItem from 'src/app/display/configuration-item/store/configuration-item.reducer';
import * as fromSearch from 'src/app/display/search/store/search.reducer';
import * as fromAdmin from 'src/app/admin/store/admin.reducer';

export const METADATA = 'metaData';
export const ADMIN = 'admin';
export const CONFIGITEM = 'configurationItem';
export const SEARCH = 'search';

export interface AppState {
    metaData: fromMetaData.State;
    configurationItem: fromConfigurationItem.State;
    search: fromSearch.State;
    admin: fromAdmin.State;
}

export const appReducer: ActionReducerMap<AppState> = {
    metaData: fromMetaData.MetaDataReducer,
    admin: fromAdmin.AdminReducer,
    configurationItem: fromConfigurationItem.ConfigurationItemReducer,
    search: fromSearch.SearchReducer,
}
