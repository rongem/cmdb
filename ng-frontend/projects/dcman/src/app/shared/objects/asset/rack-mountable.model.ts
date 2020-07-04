import { FullConfigurationItem } from 'backend-access';

import { Asset } from '../prototypes/asset.model';
import { AssetConnection } from '../connections/asset-connection.model';
import { Rack } from './rack.model';
import { Model } from '../model.model';
import { ExtendedAppConfigService } from '../../app-config.service';
import { llcc } from '../../store/functions';

export class RackMountable extends Asset {
    assetConnection: AssetConnection;
    constructor(item?: FullConfigurationItem, racks?: Rack[], models?: Model[]) {
        super(item, models);
        if (item && item.connectionsToLower && racks) {
            const conn = item.connectionsToLower.find(c =>
                llcc(c.targetType, ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Rack));
            if (conn) {
                const rack = racks.find(r => r.id === conn.targetId);
                if (rack) {
                    this.assetConnection = new AssetConnection();
                    this.assetConnection.id = conn.id;
                    this.assetConnection.connectionTypeId = conn.typeId;
                    this.assetConnection.content = conn.description;
                    if (!this.assetConnection.unit ||
                        this.assetConnection.unit !== ExtendedAppConfigService.objectModel.OtherText.HeightUnit) {
                        this.assetConnection.unit = ExtendedAppConfigService.objectModel.OtherText.HeightUnit;
                    }
                    // this.assetConnection.embeddedItem = this;
                    this.assetConnection.containerItemId = rack.id;
                }
            }
        }
    }
}
