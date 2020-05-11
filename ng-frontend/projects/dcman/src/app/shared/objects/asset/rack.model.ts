import { Asset } from '../prototypes/asset.model';
import { RoomConnection } from '../connections/room-connection.model';
import { FullConfigurationItem } from 'backend-access';
import { ExtendedAppConfigService } from '../../app-config.service';
import { Model } from '../model.model';
import { Room } from './room.model';

export class Rack extends Asset {
    heightUnits: number;
    connectionToRoom: RoomConnection;

    constructor(item: FullConfigurationItem, rooms: Room[], models: Model[]) {
        super(item, models);
        if (item) {
            if (item.attributes) {
                const heightUnits = item.attributes.find(a =>
                    a.type === ExtendedAppConfigService.objectModel.AttributeTypeNames.HeightUnits);
                this.heightUnits = heightUnits && Number.parseInt(heightUnits.value, 10) > 0  ? Number.parseInt(heightUnits.value, 10) : 42;
            } else {
                this.heightUnits = 42;
            }
            if (item.connectionsToLower) {
                const conn = item.connectionsToLower.find(c =>
                    c.targetType.toLocaleLowerCase() ===
                    ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Room.toLocaleLowerCase()
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
}
