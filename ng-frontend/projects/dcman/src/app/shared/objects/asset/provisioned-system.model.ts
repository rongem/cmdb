import { NamedObject } from '../prototypes/named-object.model';
import { FullConfigurationItem } from 'backend-access';

export class ProvisionedSystem extends NamedObject {
    id: string;
    name: string;
    typeName: string;
    connectionId: string;
    constructor(item?: FullConfigurationItem) {
        super(item);
        this.typeName = item ? item.type : '(n/a)';
    }
}
