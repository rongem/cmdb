import { Asset } from './asset.model';
import { AssetConnection } from 'src/app/shared/objects/connections/asset-connection.model';
import { FullConfigurationItem } from 'src/app/shared/objects/rest-api/full-configuration-item.model';
import { BladeEnclosure } from 'src/app/shared/objects/asset/blade-enclosure.model';
import { Model } from 'src/app/shared/objects/model.model';
import { AppConfigService } from 'src/app/shared/app-config.service';

export class EnclosureMountable extends Asset {
    connectionToEnclosure: AssetConnection;
    get slot() { return this.connectionToEnclosure ? this.connectionToEnclosure.minSlot : 0; }
    constructor(item?: FullConfigurationItem, enclosures?: BladeEnclosure[], models?: Model[]) {
        super(item, models);
        if (item && item.connectionsToLower) {
            const conn = item.connectionsToLower.find(c =>
                c.targetType.toLocaleLowerCase() ===
                AppConfigService.objectModel.ConfigurationItemTypeNames.BladeEnclosure.toLocaleLowerCase());
            if (conn) {
                const enclosure = enclosures.find(e => e.id === conn.targetId);
                if (enclosure) {
                    this.connectionToEnclosure = new AssetConnection();
                    this.connectionToEnclosure.connectionType = conn.typeId;
                    this.connectionToEnclosure.content = conn.description;
                    // this.connectionToEnclosure.embeddedItem = this;
                    this.connectionToEnclosure.containerItem = enclosure;
                }
            }
        }
    }
}
