import { Guid } from 'guid-typescript';

import * as DisplayActions from './display.actions';

import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { ItemType } from 'src/app/shared/objects/item-type.model';
import { ItemAttribute } from 'src/app/shared/objects/item-attribute.model';
import { AttributeType } from 'src/app/shared/objects/attribute-type.model';
import { ConnectionType } from 'src/app/shared/objects/connection-type.model';
import { ConnectionRule } from 'src/app/shared/objects/connection-rule.model';
import { ConfigurationItem } from 'src/app/shared/objects/configuration-item.model';
import { FullConnection } from 'src/app/shared/objects/full-connection.model';
import { Connection } from 'src/app/shared/objects/connection.model';
import { SearchAttribute } from '../search/search-attribute.model';
import { SearchConnection } from '../search/search-connection.model';

export interface State {
    configurationItem: {
        fullConfigurationItem: FullConfigurationItem;
        connectionTypeGroupsToUpper: Guid[];
        connectionRuleGroupsToUpper: Map<Guid, Guid[]>;
        connectionTypeGroupsToLower: Guid[];
        connectionRuleGroupsToLower: Map<Guid, Guid[]>;
        connectionsCount: number;
        itemReady: boolean;
        hasError: boolean;
    };
    search: {
        nameOrValue: string;
        itemType: ItemType;
        attributes: SearchAttribute[];
        connectionsToLower: SearchConnection[];
        connectionsToUpper: SearchConnection[];
        responsibleToken: string;
        usedAttributeTypes: AttributeType[];
        allowedAttributeTypes: AttributeType[];
        availableAttributeTypes: AttributeType[];
        usedConnectionTypesToUpper: ConnectionType[];
        usedConnectionTypesToLower: ConnectionType[];
        allowedConnectionTypesToUpper: ConnectionType[];
        allowedConnectionTypesToLower: ConnectionType[];
        availableConnectionTypesToUpper: ConnectionType[];
        availableConnectionTypesToLower: ConnectionType[];
        usedConnectionRulesToUpper: ConnectionRule[];
        usedConnectionRulesToLower: ConnectionRule[];
        allowedConnectionRulesToUpper: ConnectionRule[];
        allowedConnectionRulesToLower: ConnectionRule[];
        availableConnectionRulesToUpper: ConnectionRule[];
        availableConnectionRulesToLower: ConnectionRule[];
    };
    result: {
        resultList: ConfigurationItem[];
        resultListPresent: boolean;
    };
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
        allowedAttributeTypes: [],
        availableAttributeTypes: [],
        usedConnectionTypesToUpper: [],
        usedConnectionTypesToLower: [],
        allowedConnectionTypesToUpper: [],
        allowedConnectionTypesToLower: [],
        availableConnectionTypesToUpper: [],
        availableConnectionTypesToLower: [],
        usedConnectionRulesToUpper: [],
        usedConnectionRulesToLower: [],
        allowedConnectionRulesToUpper: [],
        allowedConnectionRulesToLower: [],
        availableConnectionRulesToUpper: [],
        availableConnectionRulesToLower: [],
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

export function DisplayReducer(state = initialState, action: DisplayActions.DisplayActions) {
    switch (action.type) {
        case DisplayActions.SET_CONFIGURATION_ITEM:
            const connectionGroupsToLower = getGroupsFromFullConnections(action.payload.connectionsToLower);
            const connectionGroupsToUpper = getGroupsFromFullConnections(action.payload.connectionsToUpper);
            const connectionRuleGroupsToLower = new Map<Guid, Guid[]>();
            const connectionRuleGroupsToUpper = new Map<Guid, Guid[]>();
            connectionGroupsToLower.forEach(guid =>
                connectionRuleGroupsToLower.set(guid,
                    getRulesFromFullConnectionByType(guid, action.payload.connectionsToLower)));
            connectionGroupsToUpper.forEach(guid =>
                connectionRuleGroupsToUpper.set(guid,
                    getRulesFromFullConnectionByType(guid, action.payload.connectionsToUpper)));
            return {
                ...state,
                configurationItem: {
                    ...state.configurationItem,
                    fullConfigurationItem: {...action.payload},
                    connectionTypeGroupsToLower: [...connectionGroupsToLower],
                    connectionTypeGroupsToUpper: [...connectionGroupsToUpper],
                    connectionRuleGroupsToLower: new Map<Guid, Guid[]>(connectionRuleGroupsToLower),
                    connectionRuleGroupsToUpper: new Map<Guid, Guid[]>(connectionRuleGroupsToUpper),
                    connectionsCount: action.payload.connectionsToLower.length + action.payload.connectionsToUpper.length,
                    itemReady: true,
                    hasError: false,
                },
            };
        case DisplayActions.CLEAR_CONFIGURATION_ITEM:
            return {
                ...state,
                configurationItem: {
                    fullConfigurationItem: undefined,
                    connectionTypeGroupsToLower: [],
                    connectionTypeGroupsToUpper: [],
                    connectionRuleGroupsToLower: new Map<Guid, Guid[]>(),
                    connectionRuleGroupsToUpper: new Map<Guid, Guid[]>(),
                    connectionsCount: -1,
                    itemReady: false,
                    hasError: !action.payload.Success,
                }
            };
        case DisplayActions.SEARCH_ADD_NAME_OR_VALUE:
            return {
                ...state,
                search: {
                    ...state.search,
                    nameOrValue: action.payload,
                },
            };
        case DisplayActions.SEARCH_ADD_ITEM_TYPE:
            return {
                ...state,
                search: {
                    ...state.search,
                    itemType: {...action.payload.itemType},
                    allowedAttributeTypes: [...action.payload.allowedAttributeTypes],
                    allowedConnectionTypesToUpper: [...action.payload.allowedConnectionTypesToUpper],
                    allowedConnectionTypesToLower: [...action.payload.allowedConnectionTypesToLower],
                    allowedConnectionRulesToUpper: [...action.payload.allowedConnectionRulesToUpper],
                    allowedConnectionRulesToLower: [...action.payload.allowedConnectionRulesToLower],
                },
            };
        case DisplayActions.SEARCH_DELETE_ITEM_TYPE:
            return {
                ...state,
                search: {
                    ...state.search,
                    itemType: undefined,
                    connectionsToUpper: [],
                    connectionsToLower: [],
                    allowedAttributeTypes: [...action.payload],
                    usedConnectionRulesToUpper: [],
                    usedConnectionRulesToLower: [],
                    availableConnectionRulesToUpper: [],
                    availableConnectionRulesToLower: [],
                    allowedConnectionRulesToUpper: [],
                    allowedConnectionRulesToLower: [],
                    usedConnectionTypesToUpper: [],
                    usedConnectionTypesToLower: [],
                    availableConnectionTypesToUpper: [],
                    availableConnectionTypesToLower: [],
                    allowedConnectionTypesToUpper: [],
                    allowedConnectionTypesToLower: [],
                },
            };
        case DisplayActions.SEARCH_ADD_ATTRIBUTE_TYPE:
            return {
                ...state,
                search: {
                    ...state.search,
                    usedAttributeTypes: [...state.search.usedAttributeTypes, {...action.payload}],
                    availableAttributeTypes: [...state.search.availableAttributeTypes.filter(at => at.TypeId !== action.payload.TypeId)]
                }
            };
        case DisplayActions.SEARCH_DELETE_ATTRIBUTE_TYPE:
            return {
                ...state,
                search: {
                    ...state.search,
                    usedAttributeTypes: [...state.search.usedAttributeTypes.filter(a => a.TypeId !== action.payload.TypeId)],
                    availableAttributeTypes: [...state.search.availableAttributeTypes, {...action.payload}],
                }
            };
        case DisplayActions.SEARCH_ADD_CONNECTION_TYPE_TO_LOWER:
            return {
                ...state,
                // connectionTypesToLower: [...state.connectionTypesToLower, {...action.payload}],
            };
        case DisplayActions.SEARCH_ADD_CONNECTION_TYPE_TO_UPPER:
            return {
                ...state,
                // connectionTypesToUpper: [...state.connectionTypesToUpper, {...action.payload}],
            };
        case DisplayActions.SEARCH_SET_RESULT_LIST:
            const resultListPresent = (action.payload && action.payload.length > 0);
            return {
                ...state,
                result: {
                    ...state.result,
                    resultList: [...action.payload],
                    resultListPresent,
                }
            };
        case DisplayActions.SEARCH_DELETE_RESULT_LIST:
            return {
                ...state,
                result: {
                    ...state.result,
                    resultList: [],
                }
            };
        default:
            return state;
    }
}



