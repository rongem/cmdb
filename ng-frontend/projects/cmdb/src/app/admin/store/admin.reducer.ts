import { Action, createReducer, on } from '@ngrx/store';

import * as AdminActions from './admin.actions';

import { UserRoleMapping, ItemType } from 'backend-access';

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
        on(AdminActions.setCurrentItemType, (state, actions) => ({
            ...state,
            itemType: actions.itemType,
        })),
    )(adminState, adminAction);
}
