import { Asset } from '../asset.model';
import { RoomConnection } from '../room-connection.model';
import { FullConfigurationItem } from '../rest-api/full-configuration-item.model';
import { AppConfigService } from '../../app-config.service';
import { Model } from '../model.model';
import { Room } from './room.model';

export class Rack extends Asset {
    maxHeight: number;
    connectionToRoom: RoomConnection;

    constructor(item: FullConfigurationItem, rooms: Room[], models: Model[]) {
        super(item);
        if (item) {
            if (item.attributes) {
                const maxHeight = item.attributes.find(a => a.type === AppConfigService.objectModel.AttributeTypeNames.Size);
                this.maxHeight = maxHeight && Number.parseInt(maxHeight.value, 10) > 0  ? Number.parseInt(maxHeight.value, 10) : 42;
            }
            if (item.connectionsToLower) {
                this.connectionToRoom = new RoomConnection(item, rooms); // this,
            }
        }
    }
}
