import { IRestConnectionHistory } from './rest-connection-history.model';

export interface IRestItemHistory {
    item: {
        id: string,
        typeId: string,
        type: string,
        lastChange: Date,
        oldVersions: {
            name: string,
            type: string,
            attributes: {
                id: string,
                typeId: string,
                type: string,
                value: string,
            }[],
            links: {
                id: string,
                uri: string,
                description: string,
            }[],
            responsibleUsers: string[],
            changedAt: Date,
        }[],
    };
    connectionsToLower: IRestConnectionHistory[];
    connectionsToUpper: IRestConnectionHistory[];
}
