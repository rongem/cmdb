import { NamedObject } from './named-object';
import { FullConfigurationItem } from './rest-api/full-configuration-item.model';
import { AppConfigService } from '../app-config.service';

export class Model extends NamedObject {
    manufacturer: string;
    height: number;
    width: number;
    targetType: string;

    constructor(item?: FullConfigurationItem) {
        super(item);
        if (item && item.attributes) {
            let att = item.attributes.find(a =>
                a.type.toLocaleLowerCase() === AppConfigService.objectModel.AttributeTypeNames.TargetTypeName.toLocaleLowerCase());
            if (att) {
                this.targetType = att.value.toLocaleLowerCase();
            }
            att = item.attributes.find(a =>
                a.type.toLocaleLowerCase() === AppConfigService.objectModel.AttributeTypeNames.Manufacturer.toLocaleLowerCase());
            if (att) {
                this.manufacturer = att.value;
            }
            att = item.attributes.find(a =>
                a.type.toLocaleLowerCase() === AppConfigService.objectModel.AttributeTypeNames.Size.toLocaleLowerCase());
            if (att) {
                if (att.value.toLocaleLowerCase().includes('height:')) {
                    this.height = 0;
                }
            }
        }
    }
}
