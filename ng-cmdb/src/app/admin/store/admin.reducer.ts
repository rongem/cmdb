import { Action, createReducer, on } from '@ngrx/store';
import * as AdminActions from './admin.actions';
import { UserRoleMapping } from 'src/app/shared/objects/user-role-mapping.model';

export interface State {
    users: UserRoleMapping[];
}

const initialState: State = {
    users: []
};

export function AdminReducer(adminState: State | undefined, adminAction: Action) {
    return createReducer(
        initialState,
        on(AdminActions.setUsers, (state, actions) => ({
            ...state,
            users: [...actions.userRoleMappings],
        }))
    )(adminState, adminAction);
}
