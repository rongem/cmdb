import { RackMountable } from '../rack-mountable.model';
import { FullConfigurationItem } from '../source/full-configuration-item.model';

export class BladeEnclosure extends RackMountable {
    constructor(item?: FullConfigurationItem) {
        super(item);
        if (item) {
            //
        }
    }
}
