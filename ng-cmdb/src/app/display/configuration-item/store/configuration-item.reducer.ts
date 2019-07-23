import * as ConfigurationItemActions from './configuration-item.actions';
import { Guid } from 'guid-typescript';
import * as Full from 'src/app/shared/objects/full-configuration-item.model';

export interface State {
    fullConfigurationItem: Full.FullConfigurationItem;
    connectionTypeGroupsToUpper: Guid[];
    connectionRuleGroupsToUpper: Map<Guid, Guid[]>;
    connectionTypeGroupsToLower: Guid[];
    connectionRuleGroupsToLower: Map<Guid, Guid[]>;
    connectionsCount: number;
    itemReady: boolean;
    hasError: boolean;
}

const initialState: State = {
    fullConfigurationItem: null,
    connectionTypeGroupsToUpper: [],
    connectionRuleGroupsToUpper: new Map<Guid, Guid[]>(),
    connectionTypeGroupsToLower: [],
    connectionRuleGroupsToLower: new Map<Guid, Guid[]>(),
    connectionsCount: -1,
    itemReady: false,
    hasError: false,
};

function getGroupsFromFullConnections(connections: Full.Connection[]): Guid[] {
    return [...new Set(connections.map(c => c.typeId))];
}

function getRulesFromFullConnectionByType(typeId: Guid, connections: Full.Connection[]): Guid[] {
    return [...new Set(connections.filter(c => c.typeId === typeId).map(c => c.ruleId))];
}


export function ConfigurationItemReducer(state = initialState, action: ConfigurationItemActions.ConfigurationItemActions) {
    switch (action.type) {
        case ConfigurationItemActions.SET_ITEM:
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
                fullConfigurationItem: {...action.payload},
                connectionTypeGroupsToLower: [...connectionGroupsToLower],
                connectionTypeGroupsToUpper: [...connectionGroupsToUpper],
                connectionRuleGroupsToLower: new Map<Guid, Guid[]>(connectionRuleGroupsToLower),
                connectionRuleGroupsToUpper: new Map<Guid, Guid[]>(connectionRuleGroupsToUpper),
                connectionsCount: action.payload.connectionsToLower.length + action.payload.connectionsToUpper.length,
                itemReady: true,
                hasError: false,
            };
        case ConfigurationItemActions.CLEAR_ITEM:
            return {
                ...initialState,
                fullConfigurationItem: null,
                connectionTypeGroupsToLower: [],
                connectionTypeGroupsToUpper: [],
                connectionRuleGroupsToLower: new Map<Guid, Guid[]>(),
                connectionRuleGroupsToUpper: new Map<Guid, Guid[]>(),
                connectionsCount: -1,
                itemReady: false,
                hasError: !action.payload.Success,
            };
        default:
            return state;
    }
}
