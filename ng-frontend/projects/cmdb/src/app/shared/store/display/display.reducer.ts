import { Action, createReducer, on } from '@ngrx/store';

import { DisplayActions } from '../store.api';
import { VisibleComponent } from './visible-component.enum';

export interface State {
    visibleComponent: VisibleComponent;
}

const initialState: State = {
    visibleComponent: VisibleComponent.none,
};

export const displayReducer = (displayState: State | undefined, displayAction: Action): State => createReducer(
    initialState,
    on(DisplayActions.setVisibilityState, (state, action) => ({
        ...state,
        visibleComponent: action.visibilityState === state.visibleComponent ? VisibleComponent.none : action.visibilityState,
    })),
)(displayState, displayAction);




