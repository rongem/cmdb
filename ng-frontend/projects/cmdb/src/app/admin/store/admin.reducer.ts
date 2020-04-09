import { Action, createReducer, on } from '@ngrx/store';

import * as LocalAdminActions from './admin.actions';

import { UserRoleMapping, ItemType, AdminActions } from 'backend-access';

export interface State {
    users: UserRoleMapping[];
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
            users: [...actions.userRoleMappings],
        })),
        on(LocalAdminActions.setCurrentItemType, (state, actions) => ({
            ...state,
            itemType: actions.itemType,
        })),
    )(adminState, adminAction);
}
