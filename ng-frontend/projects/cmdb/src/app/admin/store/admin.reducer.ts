import { Action, createReducer, on } from '@ngrx/store';

import * as LocalAdminActions from './admin.actions';

import { ItemType, AdminActions, UserInfo } from 'backend-access';

export interface State {
    users: UserInfo[];
    itemType: ItemType;
}

const initialState: State = {
    users: [],
    itemType: undefined,
};

export function AdminReducer(adminState: State | undefined, adminAction: Action) {
    return createReducer(
        initialState,
        on(AdminActions.setUsers, (state, actions) => ({
            ...state,
            users: [...actions.users],
        })),
        on(LocalAdminActions.setCurrentItemType, (state, actions) => ({
            ...state,
            itemType: actions.itemType,
        })),
    )(adminState, adminAction);
}
