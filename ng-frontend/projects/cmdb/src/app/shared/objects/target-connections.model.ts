import { FullConnection } from 'backend-access';

export class TargetConnections {
    connections: FullConnection[] = [];
    constructor(public targetId: string, public targetName: string, connection?: FullConnection) {
        if (connection) {
            this.connections.push(connection);
        }
    }
}
