import { Asset } from '../prototypes/asset.model';
import { RoomConnection } from '../connections/room-connection.model';
import { FullConfigurationItem } from 'backend-access';
import { ExtendedAppConfigService } from '../../app-config.service';
import { Model } from '../model.model';
import { Room } from './room.model';
import { llcc } from '../../store/functions';

export class Rack extends Asset {
    connectionToRoom: RoomConnection;

    constructor(item: FullConfigurationItem, rooms: Room[], models: Model[]) {
        super(item, models);
        if (item) {
            if (item.connectionsToLower) {
                const conn = item.connectionsToLower.find(c =>
                    llcc(c.targetType, ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Room)
                );
                if (conn) {
                    const room = rooms.find(r => r.id === conn.targetId);
                    if (room) {
                        this.connectionToRoom = new RoomConnection();
                        this.connectionToRoom.id = conn.id;
                        this.connectionToRoom.roomId = room.id;
                        // this.connectionToRoom.rackId = this.id;
                        this.connectionToRoom.connectionType = conn.typeId;
                    }
                }
            }
        }
    }

    get heightUnits() {
        return this.model && this.model.heightUnits && this.model.heightUnits > 0 ? this.model.heightUnits : 42;
    }
}
