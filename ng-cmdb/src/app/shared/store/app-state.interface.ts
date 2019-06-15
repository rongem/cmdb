import * as fromMetaData from './meta-data.reducer';
import * as fromConfigurationItem from '../../display/configuration-item/store/configuration-item.reducer';

export const METADATA = 'metaData';
export const CONFIGITEM = 'configurationItem';

export interface AppState {
    metaData: fromMetaData.MetaState;
    configurationItem: fromConfigurationItem.ConfigItemState;
}
