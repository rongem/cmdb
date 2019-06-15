import * as ConfigurationItemActions from './configuration-item.actions';
import { ConfigurationItem } from 'src/app/shared/objects/configuration-item.model';
import { ItemAttribute } from 'src/app/shared/objects/item-attribute.model';
import { UserInfo } from 'src/app/shared/objects/user-info.model';
import { Connection } from 'src/app/shared/objects/connection.model';
import { Guid } from 'guid-typescript';

export interface ConfigItemState {
    configurationItem: ConfigurationItem;
    attributes: ItemAttribute[];
    responsibilites: UserInfo[];
    connectionsToUpper: Connection[];
    connectionGroupsToUpper: Guid[];
    connectionsToLower: Connection[];
    connectionGroupsToLower: Guid[];
    connectedItems: Map<Guid, ConfigurationItem>;
    itemReady: boolean;
}

const initialState: ConfigItemState = {
    configurationItem: null,
    attributes: [],
    responsibilites: [],
    connectionsToUpper: [],
    connectionGroupsToUpper: [],
    connectionsToLower: [],
    connectionGroupsToLower: [],
    connectedItems: new Map<Guid, ConfigurationItem>(),
    itemReady: false,
};

function getGroupsFromConnections(connections: Connection[]): Guid[] {
    const guids: Guid[] = [];
    for (const connection of connections) {
        if (!guids.includes(connection.ConnType)) {
            guids.push(connection.ConnType);
        }
    }
    return guids;
}


export function configurationItemReducer(state = initialState, action: ConfigurationItemActions.ConfigurationItemActions) {
    switch (action.type) {
        case ConfigurationItemActions.SET_ITEM:
            return {
                ...state,
                configurationItem: {...action.payload},
                attributes: [],
                responsibilites: [],
                connectionsToUpper: [],
                connectionGroupsToUpper: [],
                connectionsToLower: [],
                connectionGroupsToLower: [],
                connectedItems: new Map<Guid, ConfigurationItem>(),
                itemReady: false,
            };
        case ConfigurationItemActions.SET_ATTRIBUTES:
            return {
                ...state,
                attributes: [...action.payload],
            };
        case ConfigurationItemActions.SET_RESPONSIBILITIES:
            return {
                ...state,
                responsibilites: [...action.payload],
            };
        case ConfigurationItemActions.SET_CONNECTIONS_TO_LOWER:
            return {
                ...state,
                connectionsToLower: [...action.payload],
                connectionGroupsToLower: [...getGroupsFromConnections(action.payload)],
            };
        case ConfigurationItemActions.SET_CONNECTIONS_TO_UPPER:
            return {
                ...state,
                connectionsToUpper: [...action.payload],
                connectionGroupsToUpper: [...getGroupsFromConnections(action.payload)],
            };
        case ConfigurationItemActions.SET_ITEM_READY:
            return {
                ...state,
                itemReady: true,
            };
        default:
            return {
                ...state,
            };
    }
}
