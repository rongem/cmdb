import { NamedObject } from './named-object.model';
import { AssetStatus } from '../asset/asset-status.enum';
import { Model } from '../model.model';
import { FullConfigurationItem } from 'backend-access';
import { ExtendedAppConfigService } from '../../app-config.service';
import { FullAttribute } from 'backend-access';
import { StatusCode } from '../appsettings/status-codes.model';

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

    static getStatusCodeForName(name: string) {
        const statuscode: StatusCode = Object.values(ExtendedAppConfigService.statusCodes).find((c: StatusCode) =>
            c.name.toLocaleLowerCase() === name.toLocaleLowerCase()
        );
        return statuscode ? statuscode : ExtendedAppConfigService.statusCodes.Unknown;
    }

    static getStatusCodeForAssetStatus(status: AssetStatus) {
        const statuscode: StatusCode = Object.values(ExtendedAppConfigService.statusCodes).find((c: StatusCode) => c.code === status);
        return statuscode ? statuscode : ExtendedAppConfigService.statusCodes.Stored;
    }

    get type() { return this.assetType ? this.assetType.name : ''; }

    setStatus(status: FullAttribute) {
        this.status = status ? Asset.getStatusCodeForName(status.value).code : AssetStatus.Unknown;
    }

    get statusCode() {
        return Asset.getStatusCodeForAssetStatus(this.status);
    }

    get statusName() {
        return this.statusCode.name;
    }

    get statusColor() {
        return this.statusCode.color;
    }

    get statusDescription() {
        return this.statusCode.description;
    }
}
