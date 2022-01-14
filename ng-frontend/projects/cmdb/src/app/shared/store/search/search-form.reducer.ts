import { Action, createReducer, on } from '@ngrx/store';
import { SearchAttribute, SearchContent, SearchConnection, SearchActions } from 'backend-access';
import { SearchFormActions, ItemActions } from '../store.api';

export interface State {
    form: SearchContent;
    searching: boolean;
    noSearchResult: boolean;
}

const initialState: State = {
    form: {
        nameOrValue: '',
        itemTypeId: '',
        attributes: [],
        connectionsToUpper: [],
        connectionsToLower: [],
        responsibleToken: '',
    },
    searching: false,
    noSearchResult: false,
};

export const searchFormReducer = (searchFormState: State | undefined, searchAction: Action): State => createReducer(
    initialState,
    on(SearchFormActions.searchChangeMetaData, (state, action) => {
        const types = action.attributeTypes.map(at => at.id);
        return {
            ...state,
            form: {
                ...state.form,
                attributes: state.form.attributes.filter(a => types.indexOf(a.typeId) > -1),
            }
        };
    }),
    on(SearchFormActions.addNameOrValue, (state, action) => ({
        ...state,
        form: {
            ...state.form,
            nameOrValue: action.text,
        }
    })),
    on(SearchFormActions.addItemType, (state, action) => ({
        ...state,
        form: {
            ...state.form,
            itemTypeId: action.typeId,
            attributes: [],
            connectionsToLower: [],
            connectionsToUpper: [],
        }
    })),
    on(SearchFormActions.deleteItemType, (state, action) => ({
        ...state,
        form: {
            ...state.form,
            itemTypeId: undefined,
            connectionsToLower: [],
            connectionsToUpper: [],
        }
    })),
    on(SearchFormActions.addAttributeType, (state, action) => ({
        ...state,
        form: {
            ...state.form,
            attributes: [...state.form.attributes, { typeId: action.typeId, value: ''}]
        }
    })),
    on(SearchFormActions.changeAttributeValue, (state, action) => {
        let attributes: SearchAttribute[];
        if (state.form.attributes.findIndex(a => a.typeId === action.typeId) > -1) {
            attributes = [...state.form.attributes.map(a => a.typeId === action.typeId ?
                { typeId: action.typeId, value: action.value } : a)];
        } else {
            attributes = [...state.form.attributes, {typeId: action.typeId, value: action.value}];
        }
        return {
            ...state,
            form: {
                ...state.form,
                attributes,
            }
        };
    }),
    on(SearchFormActions.deleteAttributeType, (state, action) => ({
        ...state,
        form: {
            ...state.form,
            attributes: state.form.attributes.filter(a => a.typeId !== action.typeId ),
        }
    })),
    on(SearchFormActions.addConnectionTypeToLower, (state, action) => ({
        ...state,
        form: {
            ...state.form,
            connectionsToLower: [...state.form.connectionsToLower, {
                connectionTypeId: action.connectionTypeId,
                itemTypeId: action.itemTypeId,
                count: action.count,
            }],
        }
    })),
    on(SearchFormActions.addConnectionTypeToUpper, (state, action) => ({
        ...state,
        form: {
            ...state.form,
            connectionsToUpper: [...state.form.connectionsToUpper, {
                connectionTypeId: action.connectionTypeId,
                itemTypeId: action.itemTypeId,
                count: action.count,
            }],
        }
    })),
    on(SearchFormActions.changeConnectionCountToLower, (state, action) => {
        const connectionsToLower: SearchConnection[] = [...state.form.connectionsToLower.map((c, index) =>
            index !== action.index ? c : {...c, count: action.count}
        )];
        return {
            ...state,
            form: {
                ...state.form,
                connectionsToLower,
            }
        };
    }),
    on(SearchFormActions.changeConnectionCountToUpper, (state, action) => {
        const connectionsToUpper: SearchConnection[] = [...state.form.connectionsToUpper.map((c, index) =>
            (index !== action.index) ? c : {...c, count: action.count}
        )];
        return {
            ...state,
            form: {
                ...state.form,
                connectionsToUpper,
            }
        };
    }),
    on(SearchFormActions.deleteConnectionTypeToUpper, (state, action) => ({
        ...state,
        form: {
            ...state.form,
            connectionsToUpper: state.form.connectionsToUpper.filter((value, index) => index !== action.index),
        }
    })),
    on(SearchFormActions.deleteConnectionTypeToLower, (state, action) => ({
        ...state,
        form: {
            ...state.form,
            connectionsToLower: state.form.connectionsToLower.filter((value, index) => index !== action.index),
        }
    })),
    on(SearchFormActions.setResponsibility, (state, action) => ({
        ...state,
        form: {
            ...state.form,
            responsibleToken: action.token,
        }
    })),
    on(SearchFormActions.resetForm, (state, action) => ({
        ...state,
        form: {
            ...initialState.form,
        }
    })),
    on(SearchActions.setResultListFull, (state, action) => ({
        ...state,
        searching: false,
        noSearchResult: !action.configurationItems || action.configurationItems.length === 0,
    })),
    on(SearchActions.deleteResultList, (state, action) => ({
        ...state,
        searching: false,
        noSearchResult: false,
    })),
    on(SearchActions.performSearchFull, (state, action) => ({
        ...state,
        searching: true,
    })),
    on(ItemActions.filterResultsByItemType, (state, action) => ({
        ...state,
        form: {
            ...state.form,
            itemTypeId: action.itemType.id,
        }
    })),

)(searchFormState, searchAction);
