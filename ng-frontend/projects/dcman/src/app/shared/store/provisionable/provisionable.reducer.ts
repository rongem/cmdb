import { Action, createReducer, on } from '@ngrx/store';
import { ConfigurationItem } from 'backend-access';

import * as ProvisionableActions from './provisionable.actions';

export interface State {
    provisionableSystems: ConfigurationItem[];
    systemsLoading: boolean;
    systemsLoaded: boolean;
}

const initialState: State = {
    provisionableSystems: [],
    systemsLoading: false,
    systemsLoaded: false,
};

export function ProvisionableSystemsReducer(provState: State | undefined, provAction: Action): State {
    return createReducer(
        initialState,
        on(ProvisionableActions.readProvisionableSystems, (state, action) => ({
            ...state,
            systemsLoading: true,
            systemsLoaded: false,
        })),
        on(ProvisionableActions.setProvisionableSystems, (state, action) => ({
            ...state,
            provisionableSystems: action.systems,
            systemsLoaded: true,
            systemsLoading: false,
        })),
        on(ProvisionableActions.provisionableSystemsFailed, (state, action) => ({
            ...state,
            provisionableSystems: [],
            systemsLoaded: false,
            systemsLoading: false,
        }))
    )(provState, provAction);
}
