import { RestConnectionHistory } from './rest-connection-history.model';

export class RestItemHistory {
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
    connectionsToLower: RestConnectionHistory[];
    connectionsToUpper: RestConnectionHistory[];
}
