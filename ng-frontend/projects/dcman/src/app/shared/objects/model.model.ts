import { NamedObject } from '../../shared/objects/prototypes/named-object.model';
import { FullConfigurationItem } from 'backend-access';
import { ExtendedAppConfigService } from '../app-config.service';

export class Model extends NamedObject {
    manufacturer: string;
    height: number;
    width: number;
    heightUnits: number;
    backSideSlots: number;
    targetType: string;
    get assetsCount(): number {
        return this.item && this.item.connectionsToUpper ? this.item.connectionsToUpper.length : 0;
    }

    constructor(item?: FullConfigurationItem) {
        super(item);
        if (item && item.attributes) {
            let att = item.attributes.find(a =>
                a.type.toLocaleLowerCase() === ExtendedAppConfigService.objectModel.AttributeTypeNames.TargetTypeName.toLocaleLowerCase());
            if (att) {
                this.targetType = att.value.toLocaleLowerCase();
            }
            att = item.attributes.find(a =>
                a.type.toLocaleLowerCase() === ExtendedAppConfigService.objectModel.AttributeTypeNames.Manufacturer.toLocaleLowerCase());
            if (att) {
                this.manufacturer = att.value;
            }
            att = item.attributes.find(a =>
                a.type.toLocaleLowerCase() === ExtendedAppConfigService.objectModel.AttributeTypeNames.HeightUnits.toLocaleLowerCase());
            if (att) {
                this.heightUnits = +att.value;
            }
            att = item.attributes.find(a =>
                a.type.toLocaleLowerCase() === ExtendedAppConfigService.objectModel.AttributeTypeNames.Height.toLocaleLowerCase());
            if (att) {
                this.height = +att.value;
            }
            att = item.attributes.find(a =>
                a.type.toLocaleLowerCase() === ExtendedAppConfigService.objectModel.AttributeTypeNames.Width.toLocaleLowerCase());
            if (att) {
                this.width = +att.value;
            }
            att = item.attributes.find(a =>
                a.type.toLocaleLowerCase() === ExtendedAppConfigService.objectModel.AttributeTypeNames.BackSideSlots.toLocaleLowerCase());
            if (att) {
                this.backSideSlots = +att.value;
            }
        }
    }
}
