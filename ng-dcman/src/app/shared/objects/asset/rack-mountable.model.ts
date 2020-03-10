import { Asset } from 'src/app/shared/objects/prototypes/asset.model';
import { AssetConnection } from 'src/app/shared/objects/connections/asset-connection.model';
import { FullConfigurationItem } from 'src/app/shared/objects/rest-api/full-configuration-item.model';
import { Rack } from 'src/app/shared/objects/asset/rack.model';
import { Model } from 'src/app/shared/objects/model.model';
import { AppConfigService } from 'src/app/shared/app-config.service';

export class RackMountable extends Asset {
    assetConnection: AssetConnection;
    constructor(item?: FullConfigurationItem, racks?: Rack[], models?: Model[]) {
        super(item, models);
        if (item && item.connectionsToLower && racks) {
            const conn = item.connectionsToLower.find(c =>
                c.targetType.toLocaleLowerCase() === AppConfigService.objectModel.ConfigurationItemTypeNames.Rack.toLocaleLowerCase());
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