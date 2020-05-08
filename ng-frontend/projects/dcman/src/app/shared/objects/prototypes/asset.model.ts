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
                case ExtendedAppConfigService.statusCodes.Booked.Name:
                    this.status = AssetStatus.Booked;
                    break;
                case ExtendedAppConfigService.statusCodes.Fault.Name:
                    this.status = AssetStatus.Fault;
                    break;
                case ExtendedAppConfigService.statusCodes.InProduction.Name:
                    this.status = AssetStatus.InProduction;
                    break;
                case ExtendedAppConfigService.statusCodes.PendingScrap.Name:
                    this.status = AssetStatus.PendingScrap;
                    break;
                case ExtendedAppConfigService.statusCodes.PrepareForScrap.Name:
                    this.status = AssetStatus.PrepareForScrap;
                    break;
                case ExtendedAppConfigService.statusCodes.RepairPending.Name:
                    this.status = AssetStatus.RepairPending;
                    break;
                case ExtendedAppConfigService.statusCodes.Scrapped.Name:
                    this.status = AssetStatus.Scrapped;
                    break;
                case ExtendedAppConfigService.statusCodes.Stored.Name:
                    this.status = AssetStatus.Stored;
                    break;
                case ExtendedAppConfigService.statusCodes.Unused.Name:
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
                return ExtendedAppConfigService.statusCodes.Booked.Name;
            case AssetStatus.Fault:
                return ExtendedAppConfigService.statusCodes.Fault.Name;
            case AssetStatus.InProduction:
                return ExtendedAppConfigService.statusCodes.InProduction.Name;
            case AssetStatus.PendingScrap:
                return ExtendedAppConfigService.statusCodes.PendingScrap.Name;
            case AssetStatus.PrepareForScrap:
                return ExtendedAppConfigService.statusCodes.PrepareForScrap.Name;
            case AssetStatus.RepairPending:
                return ExtendedAppConfigService.statusCodes.RepairPending.Name;
            case AssetStatus.Scrapped:
                return ExtendedAppConfigService.statusCodes.Scrapped.Name;
            case AssetStatus.Unused:
                return ExtendedAppConfigService.statusCodes.Unused.Name;
            default:
                return ExtendedAppConfigService.statusCodes.Stored.Name;
        }
    }

    get statusColor() {
        switch (this.status) {
            case AssetStatus.Booked:
                return ExtendedAppConfigService.statusCodes.Booked.Color;
            case AssetStatus.Fault:
                return ExtendedAppConfigService.statusCodes.Fault.Color;
            case AssetStatus.InProduction:
                return ExtendedAppConfigService.statusCodes.InProduction.Color;
            case AssetStatus.PendingScrap:
                return ExtendedAppConfigService.statusCodes.PendingScrap.Color;
            case AssetStatus.PrepareForScrap:
                return ExtendedAppConfigService.statusCodes.PrepareForScrap.Color;
            case AssetStatus.RepairPending:
                return ExtendedAppConfigService.statusCodes.RepairPending.Color;
            case AssetStatus.Scrapped:
                return ExtendedAppConfigService.statusCodes.Scrapped.Color;
            case AssetStatus.Unused:
                return ExtendedAppConfigService.statusCodes.Unused.Color;
            case AssetStatus.Unknown:
                return ExtendedAppConfigService.statusCodes.Unknown.Color;
            default:
                return ExtendedAppConfigService.statusCodes.Stored.Color;
        }
    }

    get statusDescription() {
        switch (this.status) {
            case AssetStatus.Booked:
                return ExtendedAppConfigService.statusCodes.Booked.Description;
            case AssetStatus.Fault:
                return ExtendedAppConfigService.statusCodes.Fault.Description;
            case AssetStatus.InProduction:
                return ExtendedAppConfigService.statusCodes.InProduction.Description;
            case AssetStatus.PendingScrap:
                return ExtendedAppConfigService.statusCodes.PendingScrap.Description;
            case AssetStatus.PrepareForScrap:
                return ExtendedAppConfigService.statusCodes.PrepareForScrap.Description;
            case AssetStatus.RepairPending:
                return ExtendedAppConfigService.statusCodes.RepairPending.Description;
            case AssetStatus.Scrapped:
                return ExtendedAppConfigService.statusCodes.Scrapped.Description;
            case AssetStatus.Unused:
                return ExtendedAppConfigService.statusCodes.Unused.Description;
            case AssetStatus.Unknown:
                return ExtendedAppConfigService.statusCodes.Unknown.Description;
            default:
                return ExtendedAppConfigService.statusCodes.Stored.Description;
        }
    }
}
