import * as AdminActions from './admin.actions';
import { UserRoleMapping } from 'src/app/shared/objects/user-role-mapping.model';

export interface State {
    users: UserRoleMapping[];
}

const initialState: State = {
    users: []
};

export function AdminReducer(state = initialState, action: AdminActions.AdminActions) {
    switch (action.type) {
        case AdminActions.SET_USERS:
            console.log(action.payload);
            return {
                ...state,
                users: [...action.payload],
            };
        default:
            return state;
    }
}
