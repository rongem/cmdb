import { NamedObject } from './named-object.model';
import { AssetStatus } from '../asset/asset-status.enum';
import { Model } from '../model.model';
import { FullConfigurationItem } from 'backend-access';
import { ExtendedAppConfigService as AppConfig } from '../../app-config.service';
import { FullAttribute } from 'backend-access';
import { StatusCode } from '../appsettings/status-codes.model';
import { llcc, llc } from '../../store/functions';

export class Asset extends NamedObject {
    model: Model;
    serialNumber: string;
    status: AssetStatus;

    constructor(item?: FullConfigurationItem, models?: Model[]) {
        super(item);
        if (item) {
            if (item.attributes) {
                const serial = item.attributes.find(a => a.type === AppConfig.objectModel.AttributeTypeNames.SerialNumber);
                this.serialNumber = serial ? serial.value : '';
                this.setStatus(item.attributes.find(a => a.type === AppConfig.objectModel.AttributeTypeNames.Status));
            }
            if (item.connectionsToLower) {
                const mdl = item.connectionsToLower.find(
                    c => llcc(c.targetType, AppConfig.objectModel.ConfigurationItemTypeNames.Model)
                );
                if (mdl) {
                    this.model = models.find(m => m.id === mdl.targetId && llcc(m.targetType, item.type));
                }
            }
        }
    }

    static getStatusCodeForName(name: string) {
        const statuscode: StatusCode = Object.values(AppConfig.statusCodes).find((c: StatusCode) => llcc(c.name, name));
        return statuscode ? statuscode : AppConfig.statusCodes.Unknown;
    }

    static getStatusCodeForAssetStatus(status: AssetStatus) {
        const statuscode: StatusCode = Object.values(AppConfig.statusCodes).find((c: StatusCode) => c.code === status);
        return statuscode ? statuscode : AppConfig.statusCodes.Stored;
    }

    get type() { return this.item && this.item.type ? llc(this.item.type) : ''; }

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
