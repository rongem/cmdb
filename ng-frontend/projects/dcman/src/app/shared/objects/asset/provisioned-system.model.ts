import { NamedObject } from '../prototypes/named-object.model';
import { FullConfigurationItem } from 'backend-access';

export class ProvisionedSystem extends NamedObject {
    typeName: string;
    constructor(item?: FullConfigurationItem) {
        super(item);
        this.typeName = item ? item.type : '(n/a)';
    }
}
