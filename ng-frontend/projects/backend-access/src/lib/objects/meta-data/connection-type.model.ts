import { RestConnectionType } from '../../rest-api/meta-data/connection-type.model';

export class ConnectionType {
    id: string;
    name: string;
    reverseName: string;

    constructor(connectionType?: RestConnectionType) {
        if (connectionType) {
            this.id = connectionType.id;
            this.name = connectionType.name;
            this.reverseName = connectionType.reverseName;
        }
    }
}
