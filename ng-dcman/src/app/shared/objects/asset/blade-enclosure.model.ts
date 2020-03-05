import { RackMountable } from 'src/app/shared/objects/asset/rack-mountable.model';
import { FullConfigurationItem } from 'src/app/shared/objects/rest-api/full-configuration-item.model';
import { Rack } from 'src/app/shared/objects/asset/rack.model';
import { Model } from 'src/app/shared/objects/model.model';

export class BladeEnclosure extends RackMountable {
    constructor(item?: FullConfigurationItem, racks?: Rack[], models?: Model[]) {
        super(item, racks, models);
        if (item) {
            //
        }
    }
}
