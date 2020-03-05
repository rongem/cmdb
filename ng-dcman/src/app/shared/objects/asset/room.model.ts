import { NamedObject } from 'src/app/shared/objects/prototypes/named-object.model';
import { FullConfigurationItem } from 'src/app/shared/objects/rest-api/full-configuration-item.model';
import { AppConfigService } from 'src/app/shared/app-config.service';

export class Room extends NamedObject {
    building: string;

    constructor(item?: FullConfigurationItem) {
        super(item);
        if (item && item.attributes) {
            const building = item.attributes.find(a => a.type === AppConfigService.objectModel.AttributeTypeNames.BuildingName);
            this.building = building ? building.value : '(n/a)';
        }
    }
}
