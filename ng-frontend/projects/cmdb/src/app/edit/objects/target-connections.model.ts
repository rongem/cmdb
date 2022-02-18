import { FullConnection } from 'backend-access';

class ConnectionInfo {
    sourceItemId: string;
    connection: FullConnection;
}
export class TargetConnections {
    connectionInfos: ConnectionInfo[] = [];
    constructor(public targetId: string, public targetName: string, connectionInfo?: ConnectionInfo) {
        if (connectionInfo) {
            this.connectionInfos.push(connectionInfo);
        }
    }
}
