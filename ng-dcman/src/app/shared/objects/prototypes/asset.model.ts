import { NamedObject } from './named-object.model';
import { AssetStatus } from 'src/app/shared/objects/asset/asset-status.enum';
import { Model } from 'src/app/shared/objects/model.model';
import { FullConfigurationItem } from 'src/app/shared/objects/rest-api/full-configuration-item.model';
import { AppConfigService } from 'src/app/shared/app-config.service';
import { FullAttribute } from 'src/app/shared/objects/rest-api/full-attribute.model';

export class Asset extends NamedObject {
    assetType: NamedObject;
    model: Model;
    serialNumber: string;
    status: AssetStatus;

    constructor(item?: FullConfigurationItem, models?: Model[]) {
        super(item);
        if (item) {
            if (item.attributes) {
                this.assetType = { id: item.typeId, name: item.type };
                const serial = item.attributes.find(a => a.type === AppConfigService.objectModel.AttributeTypeNames.SerialNumber);
                this.serialNumber = serial ? serial.value : '';
                this.setStatus(item.attributes.find(a => a.type === AppConfigService.objectModel.AttributeTypeNames.Status));
            }
            if (item.connectionsToLower) {
                const mdl = item.connectionsToLower.find(
                    c => c.targetType.toLocaleLowerCase() ===
                    AppConfigService.objectModel.ConfigurationItemTypeNames.Model.toLocaleLowerCase()
                );
                if (mdl) {
                    this.model = models.find(m =>
                        m.id === mdl.targetId && m.targetType.toLocaleLowerCase() === item.type.toLocaleLowerCase()
                    );
                }
            }
        }
    }

    setStatus(status: FullAttribute) {
        if (status) {
            switch (status.value) {
                case AppConfigService.statusCodes.Booked.Name:
                    this.status = AssetStatus.Booked;
                    break;
                case AppConfigService.statusCodes.Fault.Name:
                    this.status = AssetStatus.Fault;
                    break;
                case AppConfigService.statusCodes.InProduction.Name:
                    this.status = AssetStatus.InProduction;
                    break;
                case AppConfigService.statusCodes.PendingScrap.Name:
                    this.status = AssetStatus.PendingScrap;
                    break;
                case AppConfigService.statusCodes.PrepareForScrap.Name:
                    this.status = AssetStatus.PrepareForScrap;
                    break;
                case AppConfigService.statusCodes.RepairPending.Name:
                    this.status = AssetStatus.RepairPending;
                    break;
                case AppConfigService.statusCodes.Scrapped.Name:
                    this.status = AssetStatus.Scrapped;
                    break;
                case AppConfigService.statusCodes.Stored.Name:
                    this.status = AssetStatus.Stored;
                    break;
                case AppConfigService.statusCodes.Unused.Name:
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
                return AppConfigService.statusCodes.Booked.Name;
            case AssetStatus.Fault:
                return AppConfigService.statusCodes.Fault.Name;
            case AssetStatus.InProduction:
                return AppConfigService.statusCodes.InProduction.Name;
            case AssetStatus.PendingScrap:
                return AppConfigService.statusCodes.PendingScrap.Name;
            case AssetStatus.PrepareForScrap:
                return AppConfigService.statusCodes.PrepareForScrap.Name;
            case AssetStatus.RepairPending:
                return AppConfigService.statusCodes.RepairPending.Name;
            case AssetStatus.Scrapped:
                return AppConfigService.statusCodes.Scrapped.Name;
            case AssetStatus.Unused:
                return AppConfigService.statusCodes.Unused.Name;
            default:
                return AppConfigService.statusCodes.Stored.Name;
        }
    }

    get statusColor() {
        switch (this.status) {
            case AssetStatus.Booked:
                return AppConfigService.statusCodes.Booked.Color;
            case AssetStatus.Fault:
                return AppConfigService.statusCodes.Fault.Color;
            case AssetStatus.InProduction:
                return AppConfigService.statusCodes.InProduction.Color;
            case AssetStatus.PendingScrap:
                return AppConfigService.statusCodes.PendingScrap.Color;
            case AssetStatus.PrepareForScrap:
                return AppConfigService.statusCodes.PrepareForScrap.Color;
            case AssetStatus.RepairPending:
                return AppConfigService.statusCodes.RepairPending.Color;
            case AssetStatus.Scrapped:
                return AppConfigService.statusCodes.Scrapped.Color;
            case AssetStatus.Unused:
                return AppConfigService.statusCodes.Unused.Color;
            case AssetStatus.Unknown:
                return AppConfigService.statusCodes.Unknown.Color;
            default:
                return AppConfigService.statusCodes.Stored.Color;
        }
    }

    get statusDescription() {
        switch (this.status) {
            case AssetStatus.Booked:
                return AppConfigService.statusCodes.Booked.Description;
            case AssetStatus.Fault:
                return AppConfigService.statusCodes.Fault.Description;
            case AssetStatus.InProduction:
                return AppConfigService.statusCodes.InProduction.Description;
            case AssetStatus.PendingScrap:
                return AppConfigService.statusCodes.PendingScrap.Description;
            case AssetStatus.PrepareForScrap:
                return AppConfigService.statusCodes.PrepareForScrap.Description;
            case AssetStatus.RepairPending:
                return AppConfigService.statusCodes.RepairPending.Description;
            case AssetStatus.Scrapped:
                return AppConfigService.statusCodes.Scrapped.Description;
            case AssetStatus.Unused:
                return AppConfigService.statusCodes.Unused.Description;
            case AssetStatus.Unknown:
                return AppConfigService.statusCodes.Unknown.Description;
            default:
                return AppConfigService.statusCodes.Stored.Description;
        }
    }
}
