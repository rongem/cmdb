import { FullConfigurationItem } from 'backend-access';

import { Asset } from '../prototypes/asset.model';
import { AssetConnection } from '../connections/asset-connection.model';
import { BladeEnclosure } from './blade-enclosure.model';
import { Model } from '../model.model';
import { ExtendedAppConfigService } from '../../app-config.service';

export class EnclosureMountable extends Asset {
    connectionToEnclosure: AssetConnection;
    get slot() { return this.connectionToEnclosure ? this.connectionToEnclosure.minSlot : 0; }
    get height() { return this.model && this.model.height > 0 ? this.model.height : 1; }
    get width() { return this.model && this.model.width > 0 ? this.model.width : 1; }

    constructor(item?: FullConfigurationItem, enclosures?: BladeEnclosure[], models?: Model[]) {
        super(item, models);
        if (item && item.connectionsToLower) {
            const conn = item.connectionsToLower.find(c =>
                c.targetType.toLocaleLowerCase() ===
                ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BladeEnclosure.toLocaleLowerCase());
            if (conn) {
                const enclosure = enclosures.find(e => e.id === conn.targetId);
                if (enclosure) {
                    this.connectionToEnclosure = new AssetConnection();
                    this.connectionToEnclosure.connectionTypeId = conn.typeId;
                    this.connectionToEnclosure.content = conn.description;
                    if (!this.connectionToEnclosure.unit ||
                        this.connectionToEnclosure.unit !== ExtendedAppConfigService.objectModel.OtherText.Slot) {
                        this.connectionToEnclosure.unit = ExtendedAppConfigService.objectModel.OtherText.Slot;
                    }
                    // this.connectionToEnclosure.embeddedItemId = this.id;
                    this.connectionToEnclosure.containerItemId = enclosure.id;
                }
            }
        }
    }
}
