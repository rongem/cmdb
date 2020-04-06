import { RackMountable } from './rack-mountable.model';
import { FullConfigurationItem } from '../rest-api/full-configuration-item.model';
import { Rack } from './rack.model';
import { Model } from '../model.model';

export class BladeEnclosure extends RackMountable {
    constructor(item?: FullConfigurationItem, racks?: Rack[], models?: Model[]) {
        super(item, racks, models);
        if (item) {
            //
        }
    }
}
