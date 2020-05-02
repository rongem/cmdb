import { Asset } from '../prototypes/asset.model';
import { AssetConnection } from '../connections/asset-connection.model';
import { FullConfigurationItem } from 'backend-access';
import { Rack } from './rack.model';
import { Model } from '../model.model';
import { ExtendedAppConfigService } from '../../app-config.service';

export class RackMountable extends Asset {
    assetConnection: AssetConnection;
    constructor(item?: FullConfigurationItem, racks?: Rack[], models?: Model[]) {
        super(item, models);
        if (item && item.connectionsToLower && racks) {
            const conn = item.connectionsToLower.find(c =>
                c.targetType.toLocaleLowerCase() ===
                ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Rack.toLocaleLowerCase());
            if (conn) {
                const rack = racks.find(r => r.id === conn.targetId);
                if (rack) {
                    this.assetConnection = new AssetConnection();
                    this.assetConnection.connectionType = conn.typeId;
                    this.assetConnection.content = conn.description;
                    // this.assetConnection.embeddedItem = this;
                    this.assetConnection.containerItem = rack;
                }
            }
        }
    }
}
