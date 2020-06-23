import { Action, createReducer, on } from '@ngrx/store';
import { ConfigurationItem } from 'backend-access';

import * as ProvisionableActions from './provisionable.actions';

export interface State {
    provisionableSystems: ConfigurationItem[];
    systemsLoading: boolean;
    systemsReady: boolean;
}

const initialState: State = {
    provisionableSystems: [],
    systemsLoading: false,
    systemsReady: false,
};

export function ProvisionableSystemsReducer(provState: State | undefined, provAction: Action): State {
    return createReducer(
        initialState,
        on(ProvisionableActions.readProvisionableSystems, (state, action) => ({
            ...state,
            systemsLoading: true,
            systemsReady: false,
        })),
        on(ProvisionableActions.setProvisionableSystems, (state, action) => ({
            ...state,
            provisionableSystems: action.systems,
            systemsLoading: false,
            systemsReady: true,
        })),
        on(ProvisionableActions.provisionableSystemsFailed, (state, action) => ({
            ...state,
            provisionableSystems: [],
            systemsLoading: false,
            systemsReady: false,
        })),
        on(ProvisionableActions.removeProvisionedSystem, (state, action) => ({
            ...state,
            provisionableSystems: state.provisionableSystems.filter(s => s.id !== action.provisionedSystem.id),
        })),
        on(ProvisionableActions.addProvisionableSystem, (state, action) => ({
            ...state,
            provisionableSystems: [...state.provisionableSystems, action.system],
        })),
    )(provState, provAction);
}
