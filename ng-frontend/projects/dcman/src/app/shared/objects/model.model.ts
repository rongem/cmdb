import { NamedObject } from '../../shared/objects/prototypes/named-object.model';
import { FullConfigurationItem } from 'backend-access';
import { ExtendedAppConfigService } from '../app-config.service';
import { llc, llcc } from '../store/functions';

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
                llcc(a.type, ExtendedAppConfigService.objectModel.AttributeTypeNames.TargetTypeName));
            if (att) {
                llc(this.targetType = att.value);
            }
            att = item.attributes.find(a =>
                llcc(a.type, ExtendedAppConfigService.objectModel.AttributeTypeNames.Manufacturer));
            if (att) {
                this.manufacturer = att.value;
            }
            att = item.attributes.find(a =>
                llcc(a.type, ExtendedAppConfigService.objectModel.AttributeTypeNames.HeightUnits));
            if (att) {
                this.heightUnits = +att.value;
            }
            att = item.attributes.find(a =>
                llcc(a.type, ExtendedAppConfigService.objectModel.AttributeTypeNames.Height));
            if (att) {
                this.height = +att.value;
            }
            att = item.attributes.find(a =>
                llcc(a.type, ExtendedAppConfigService.objectModel.AttributeTypeNames.Width));
            if (att) {
                this.width = +att.value;
            }
            att = item.attributes.find(a =>
                llcc(a.type, ExtendedAppConfigService.objectModel.AttributeTypeNames.BackSideSlots));
            if (att) {
                this.backSideSlots = +att.value;
            }
        }
    }
}
