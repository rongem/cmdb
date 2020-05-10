import { NamedObject } from './named-object.model';
import { AssetStatus } from '../asset/asset-status.enum';
import { Model } from '../model.model';
import { FullConfigurationItem } from 'backend-access';
import { ExtendedAppConfigService } from '../../app-config.service';
import { FullAttribute } from 'backend-access';

export class Asset extends NamedObject {
    assetType: NamedObject;
    model: Model;
    serialNumber: string;
    status: AssetStatus;

    constructor(item?: FullConfigurationItem, models?: Model[]) {
        super(item);
        if (item) {
            this.assetType = { id: item.typeId, name: item.type };
            if (item.attributes) {
                const serial = item.attributes.find(a => a.type === ExtendedAppConfigService.objectModel.AttributeTypeNames.SerialNumber);
                this.serialNumber = serial ? serial.value : '';
                this.setStatus(item.attributes.find(a => a.type === ExtendedAppConfigService.objectModel.AttributeTypeNames.Status));
            }
            if (item.connectionsToLower) {
                const mdl = item.connectionsToLower.find(
                    c => c.targetType.toLocaleLowerCase() ===
                    ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Model.toLocaleLowerCase()
                );
                if (mdl) {
                    this.model = models.find(m =>
                        m.id === mdl.targetId && m.targetType.toLocaleLowerCase() === item.type.toLocaleLowerCase()
                    );
                }
            }
        }
    }

    get type() { return this.assetType ? this.assetType.name : ''; }

    setStatus(status: FullAttribute) {
        if (status) {
            switch (status.value) {
                case ExtendedAppConfigService.statusCodes.Booked.name:
                    this.status = AssetStatus.Booked;
                    break;
                case ExtendedAppConfigService.statusCodes.Fault.name:
                    this.status = AssetStatus.Fault;
                    break;
                case ExtendedAppConfigService.statusCodes.InProduction.name:
                    this.status = AssetStatus.InProduction;
                    break;
                case ExtendedAppConfigService.statusCodes.PendingScrap.name:
                    this.status = AssetStatus.PendingScrap;
                    break;
                case ExtendedAppConfigService.statusCodes.PrepareForScrap.name:
                    this.status = AssetStatus.PrepareForScrap;
                    break;
                case ExtendedAppConfigService.statusCodes.RepairPending.name:
                    this.status = AssetStatus.RepairPending;
                    break;
                case ExtendedAppConfigService.statusCodes.Scrapped.name:
                    this.status = AssetStatus.Scrapped;
                    break;
                case ExtendedAppConfigService.statusCodes.Stored.name:
                    this.status = AssetStatus.Stored;
                    break;
                case ExtendedAppConfigService.statusCodes.Unused.name:
                    this.status = AssetStatus.Unused;
                    break;
                default:
                    this.status = AssetStatus.Unknown;
                    break;
            }
        } else {
            this.status = AssetStatus.Unknown;
        }
    }

    get statusName() {
        switch (this.status) {
            case AssetStatus.Booked:
                return ExtendedAppConfigService.statusCodes.Booked.name;
            case AssetStatus.Fault:
                return ExtendedAppConfigService.statusCodes.Fault.name;
            case AssetStatus.InProduction:
                return ExtendedAppConfigService.statusCodes.InProduction.name;
            case AssetStatus.PendingScrap:
                return ExtendedAppConfigService.statusCodes.PendingScrap.name;
            case AssetStatus.PrepareForScrap:
                return ExtendedAppConfigService.statusCodes.PrepareForScrap.name;
            case AssetStatus.RepairPending:
                return ExtendedAppConfigService.statusCodes.RepairPending.name;
            case AssetStatus.Scrapped:
                return ExtendedAppConfigService.statusCodes.Scrapped.name;
            case AssetStatus.Unused:
                return ExtendedAppConfigService.statusCodes.Unused.name;
            default:
                return ExtendedAppConfigService.statusCodes.Stored.name;
        }
    }

    get statusColor() {
        switch (this.status) {
            case AssetStatus.Booked:
                return ExtendedAppConfigService.statusCodes.Booked.color;
            case AssetStatus.Fault:
                return ExtendedAppConfigService.statusCodes.Fault.color;
            case AssetStatus.InProduction:
                return ExtendedAppConfigService.statusCodes.InProduction.color;
            case AssetStatus.PendingScrap:
                return ExtendedAppConfigService.statusCodes.PendingScrap.color;
            case AssetStatus.PrepareForScrap:
                return ExtendedAppConfigService.statusCodes.PrepareForScrap.color;
            case AssetStatus.RepairPending:
                return ExtendedAppConfigService.statusCodes.RepairPending.color;
            case AssetStatus.Scrapped:
                return ExtendedAppConfigService.statusCodes.Scrapped.color;
            case AssetStatus.Unused:
                return ExtendedAppConfigService.statusCodes.Unused.color;
            case AssetStatus.Unknown:
                return ExtendedAppConfigService.statusCodes.Unknown.color;
            default:
                return ExtendedAppConfigService.statusCodes.Stored.color;
        }
    }

    get statusDescription() {
        switch (this.status) {
            case AssetStatus.Booked:
                return ExtendedAppConfigService.statusCodes.Booked.description;
            case AssetStatus.Fault:
                return ExtendedAppConfigService.statusCodes.Fault.description;
            case AssetStatus.InProduction:
                return ExtendedAppConfigService.statusCodes.InProduction.description;
            case AssetStatus.PendingScrap:
                return ExtendedAppConfigService.statusCodes.PendingScrap.description;
            case AssetStatus.PrepareForScrap:
                return ExtendedAppConfigService.statusCodes.PrepareForScrap.description;
            case AssetStatus.RepairPending:
                return ExtendedAppConfigService.statusCodes.RepairPending.description;
            case AssetStatus.Scrapped:
                return ExtendedAppConfigService.statusCodes.Scrapped.description;
            case AssetStatus.Unused:
                return ExtendedAppConfigService.statusCodes.Unused.description;
            case AssetStatus.Unknown:
                return ExtendedAppConfigService.statusCodes.Unknown.description;
            default:
                return ExtendedAppConfigService.statusCodes.Stored.description;
        }
    }
}
