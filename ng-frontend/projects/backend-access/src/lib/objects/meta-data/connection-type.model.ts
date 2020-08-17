import { RestConnectionType } from '../../rest-api/meta-data/connection-type.model';
import { OldRestConnectionType } from '../../old-rest-api/meta-data/connection-type.model';
import { Guid } from '../../guid';

export class ConnectionType {
    id: string;
    name: string;
    reverseName: string;

    constructor(connectionType?: RestConnectionType | OldRestConnectionType) {
        if (connectionType) {
            if (connectionType instanceof RestConnectionType) {
                this.id = connectionType.id;
                this.name = connectionType.name;
                this.reverseName = connectionType.reverseName;
            } else {
                this.id = Guid.parse(connectionType.ConnTypeId).toString();
                this.name = connectionType.ConnTypeName;
                this.reverseName = connectionType.ConnTypeReverseName;
            }
        }
    }
}
