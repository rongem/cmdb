import { IRestConnectionType } from '../../rest-api/meta-data/connection-type.model';

export class ConnectionType {
    id: string;
    name: string;
    reverseName: string;

    constructor(connectionType?: IRestConnectionType) {
        if (connectionType) {
            this.id = connectionType.id;
            this.name = connectionType.name;
            this.reverseName = connectionType.reverseName;
        }
    }
}
