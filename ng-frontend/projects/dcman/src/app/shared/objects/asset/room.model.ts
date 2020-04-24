import { NamedObject } from '../prototypes/named-object.model';
import { FullConfigurationItem } from 'backend-access';
import { ExtendedAppConfigService } from '../../../shared/app-config.service';

export class Room extends NamedObject {
    building: string;

    constructor(item?: FullConfigurationItem) {
        super(item);
        if (item && item.attributes) {
            const building = item.attributes.find(a => a.type === ExtendedAppConfigService.objectModel.AttributeTypeNames.BuildingName);
            this.building = building ? building.value : '(n/a)';
        }
    }
}
