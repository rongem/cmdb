import { Asset } from './asset.model';
import { AssetConnection } from './asset-connection.model';
import { FullConfigurationItem } from './rest-api/full-configuration-item.model';
import { Rack } from './asset/rack.model';
import { Model } from './model.model';
import { AppConfigService } from '../app-config.service';

export class RackMountable extends Asset {
    assetConnection: AssetConnection;
    constructor(item?: FullConfigurationItem, racks?: Rack[], models?: Model[]) {
        super(item, models);
        if (item && item.connectionsToLower && racks) {
            const conn = item.connectionsToLower.find(c =>
                c.targetType.toLocaleLowerCase() === AppConfigService.objectModel.ConfigurationItemTypeNames.Rack);
            if (conn) {
                const rack = racks.find(r => r.id === conn.targetId);
                if (rack) {
                    this.assetConnection = new AssetConnection();
                    this.assetConnection.connectionType = conn.typeId;
                    this.assetConnection.content = conn.description;
                    this.assetConnection.embeddedItem = this;
                    this.assetConnection.containerItem = rack;
                }
            }
        }
    }
}
