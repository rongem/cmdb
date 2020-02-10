import { NamedObject } from '../named-object';
import { FullConfigurationItem } from '../source/full-configuration-item.model';
import { AppConfigService } from '../../app-config.service';

export class Room extends NamedObject {
    building: string;

    constructor(item?: FullConfigurationItem) {
        super(item);
        if (item && item.attributes) {
            const building = item.attributes.find(a => a.type === AppConfigService.objectModel.AttributeTypeNames.BuildingName);
            this.building = building ? building.value : 'n/a';
        }
    }
}
