import { RestConnectionType } from '../../rest-api/meta-data/connection-type.model';
import { Guid } from '../../guid';

export class ConnectionType {
    id: string;
    name: string;
    reverseName: string;

    constructor(connectionType?: RestConnectionType) {
        if (connectionType) {
            this.id = Guid.parse(connectionType.ConnTypeId).toString();
            this.name = connectionType.ConnTypeName;
            this.reverseName = connectionType.ConnTypeReverseName;
        }
    }
}
