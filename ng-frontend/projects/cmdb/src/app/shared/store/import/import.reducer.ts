import { Action, createReducer, on } from '@ngrx/store';
import { ImportSettings } from '../../objects/import-settings.model';
import { ImportActions } from '../store.api';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface State extends ImportSettings{
}

const initialState: State = {
    itemTypeId: undefined,
    attributes: false,
    connectionsToLower: false,
    connectionsToUpper: false,
    links: false,
};

export const importReducer = (importState: State | undefined, importAction: Action): State => createReducer(
    initialState,
    on(ImportActions.setState, (state, action) => ({
        ...state,
        itemTypeId: action.itemTypeId,
        attributes: action.attributes,
        connectionsToLower: action.connectionsToLower,
        connectionsToUpper: action.connectionsToUpper,
        links: action.links,
    })),
)(importState, importAction);
