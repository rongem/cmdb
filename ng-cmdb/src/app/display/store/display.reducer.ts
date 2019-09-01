import { Action, createReducer, on } from '@ngrx/store';
import { Guid } from 'guid-typescript';

import * as DisplayActions from './display.actions';

import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { ConfigurationItem } from 'src/app/shared/objects/configuration-item.model';
import { FullConnection } from 'src/app/shared/objects/full-connection.model';
import { Connection } from 'src/app/shared/objects/connection.model';
import { SearchAttribute } from '../search/search-attribute.model';
import { SearchConnection } from '../search/search-connection.model';

export interface ConfigurationItemState {
    fullConfigurationItem: FullConfigurationItem;
    connectionTypeGroupsToUpper: Guid[];
    connectionRuleGroupsToUpper: Map<Guid, Guid[]>;
    connectionTypeGroupsToLower: Guid[];
    connectionRuleGroupsToLower: Map<Guid, Guid[]>;
    connectionsCount: number;
    itemReady: boolean;
    hasError: boolean;
}

export interface SearchState {
    nameOrValue: string;
    itemType: Guid;
    attributes: SearchAttribute[];
    connectionsToLower: SearchConnection[];
    connectionsToUpper: SearchConnection[];
    responsibleToken: string;
    usedAttributeTypes: Guid[];
    usedConnectionTypesToUpper: Guid[];
    usedConnectionTypesToLower: Guid[];
    usedConnectionRulesToUpper: Guid[];
    usedConnectionRulesToLower: Guid[];
}

export interface ResultState {
    resultList: ConfigurationItem[];
    resultListPresent: boolean;
}

export interface State {
    configurationItem: ConfigurationItemState;
    search: SearchState;
    result: ResultState;
}

const initialState: State = {
    configurationItem: {
        fullConfigurationItem: undefined,
        connectionTypeGroupsToUpper: [],
        connectionRuleGroupsToUpper: new Map<Guid, Guid[]>(),
        connectionTypeGroupsToLower: [],
        connectionRuleGroupsToLower: new Map<Guid, Guid[]>(),
        connectionsCount: -1,
        itemReady: false,
        hasError: false,
    },
    search: {
        nameOrValue: '',
        itemType: undefined,
        attributes: [],
        connectionsToUpper: [],
        connectionsToLower: [],
        responsibleToken: '',
        usedAttributeTypes: [],
        usedConnectionTypesToUpper: [],
        usedConnectionTypesToLower: [],
        usedConnectionRulesToUpper: [],
        usedConnectionRulesToLower: [],
    },
    result: {
        resultList: [],
        resultListPresent: false,
    },
};

function getGroupsFromFullConnections(connections: FullConnection[]): Guid[] {
    return [...new Set(connections.map(c => c.typeId))];
}

function getRulesFromFullConnectionByType(typeId: Guid, connections: FullConnection[]): Guid[] {
    return [...new Set(connections.filter(c => c.typeId === typeId).map(c => c.ruleId))];
}

function getGroupsFromConnections(connections: Connection[]): Guid[] {
    return [...new Set(connections.map(c => c.ConnType))];
}

function getRulesFromConnectionByType(typeId: Guid, connections: Connection[]): Guid[] {
    return [...new Set(connections.filter(c => c.ConnType === typeId).map(c => c.RuleId))];
}

export function DisplayReducer(displayState: State | undefined, displayAction: Action): State {
    return createReducer(
        initialState,
        on(DisplayActions.setConfigurationItem, (state, action) => {
            const connectionGroupsToLower = getGroupsFromFullConnections(action.configurationItem.connectionsToLower);
            const connectionGroupsToUpper = getGroupsFromFullConnections(action.configurationItem.connectionsToUpper);
            const connectionRuleGroupsToLower = new Map<Guid, Guid[]>();
            const connectionRuleGroupsToUpper = new Map<Guid, Guid[]>();
            connectionGroupsToLower.forEach(guid =>
                connectionRuleGroupsToLower.set(guid,
                    getRulesFromFullConnectionByType(guid, action.configurationItem.connectionsToLower)));
            connectionGroupsToUpper.forEach(guid =>
                connectionRuleGroupsToUpper.set(guid,
                    getRulesFromFullConnectionByType(guid, action.configurationItem.connectionsToUpper)));
            return {
                ...state,
                configurationItem: {
                    ...state.configurationItem,
                    fullConfigurationItem: {...action.configurationItem},
                    connectionTypeGroupsToLower: [...connectionGroupsToLower],
                    connectionTypeGroupsToUpper: [...connectionGroupsToUpper],
                    connectionRuleGroupsToLower: new Map<Guid, Guid[]>(connectionRuleGroupsToLower),
                    connectionRuleGroupsToUpper: new Map<Guid, Guid[]>(connectionRuleGroupsToUpper),
                    connectionsCount: action.configurationItem.connectionsToLower.length +
                        action.configurationItem.connectionsToUpper.length,
                    itemReady: true,
                    hasError: false,
                },
            };
        }),
        on(DisplayActions.clearConfigurationItem, (state, action) => ({
            ...state,
            configurationItem: {
                fullConfigurationItem: undefined,
                connectionTypeGroupsToLower: [],
                connectionTypeGroupsToUpper: [],
                connectionRuleGroupsToLower: new Map<Guid, Guid[]>(),
                connectionRuleGroupsToUpper: new Map<Guid, Guid[]>(),
                connectionsCount: -1,
                itemReady: false,
                hasError: !action.result.Success,
            }
        })),
        on(DisplayActions.searchChangeMetaData, (state, action) => {
            const types = action.attributeTypes.map(at => at.TypeId);
            return {
                ...state,
                search: {
                    ...state.search,
                    attributes: state.search.attributes.filter(a => types.indexOf(a.attributeTypeId) > -1),
                }
            };
        }),
        on(DisplayActions.searchAddNameOrValue, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                nameOrValue: action.text,
            }
        })),
        on(DisplayActions.searchAddItemType, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                itemType: action.itemTypeId,
            }
        })),
        on(DisplayActions.searchDeleteItemType, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                itemType: undefined,
                usedConnectionRulesToUpper: [],
                usedConnectionRulesToLower: [],
                usedConnectionTypesToUpper: [],
                usedConnectionTypesToLower: [],
            }
        })),
        on(DisplayActions.searchAddAttributeType, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                usedAttributeTypes: [...state.search.usedAttributeTypes, action.attributeTypeId],
            }
        })),
        on(DisplayActions.searchDeleteAttributeType, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                usedAttributeTypes: state.search.usedAttributeTypes.filter(a => a !== action.attributeTypeId),
            }
        })),
        on(DisplayActions.searchAddConnectionTypeToLower, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                usedConnectionTypesToLower: [...state.search.usedConnectionTypesToLower, action.connectionTypeId],
            }
        })),
        on(DisplayActions.searchAddConnectionTypeToUpper, (state, action) => ({
            ...state,
            search: {
                ...state.search,
                usedConnectionTypesToUpper: [...state.search.usedConnectionTypesToUpper, action.connectionTypeId],
            }
        })),
        on(DisplayActions.setResultList, (state, action) => ({
            ...state,
            result: {
                ...state.result,
                resultList: [...action.configurationItems],
                resultListPresent: action.configurationItems && action.configurationItems.length > 0,
            }
        })),
        on(DisplayActions.deleteResultList, (state, action) => ({
            ...state,
            result: {
                ...state.result,
                resultList: [],
            }
        })),
    )(displayState, displayAction);
}



