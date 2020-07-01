import { RackMountable } from './rack-mountable.model';
import { FullConfigurationItem } from 'backend-access';
import { Rack } from './rack.model';
import { Model } from '../model.model';

export class BladeEnclosure extends RackMountable {
    get width() { return this.model && this.model.width > 0 ? this.model.width : 8; }
    get height() { return this.model && this.model.height > 0 ? this.model.height : 2; }

    constructor(item?: FullConfigurationItem, racks?: Rack[], models?: Model[]) {
        super(item, racks, models);
        if (item) {
            //
        }
    }
}
