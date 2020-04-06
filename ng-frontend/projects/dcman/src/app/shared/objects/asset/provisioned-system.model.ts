import { NamedObject } from '../prototypes/named-object.model';
import { FullConfigurationItem } from '../rest-api/full-configuration-item.model';

export class ProvisionedSystem extends NamedObject {
    typeName: string;
    constructor(item?: FullConfigurationItem) {
        super(item);
        this.typeName = item ? item.type : '(n/a)';
    }
}
