/* eslint-disable prefer-arrow/prefer-arrow-functions */
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

const accountNameCompare = ((a: UserInfo, b: UserInfo) => a.accountName.localeCompare(b.accountName));

export function adminReducer(adminState: State | undefined, adminAction: Action) {
    return createReducer(
        initialState,
        on(AdminActions.storeUsers, (state, action) => ({
            ...state,
            users: [...action.users],
        })),
        on(AdminActions.storeUser, (state, action) => ({
            ...state,
            users: [...state.users.filter(u => u.accountName !== action.user.accountName), action.user].sort(accountNameCompare),
        })),
        on(AdminActions.unstoreUser, (state, action) => ({
            ...state,
            users: [...state.users.filter(u => u.accountName !== action.user.accountName)],
        })),
        on(LocalAdminActions.setCurrentItemType, (state, actions) => ({
            ...state,
            itemType: actions.itemType,
        })),
    )(adminState, adminAction);
}
