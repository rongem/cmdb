import { Asset } from 'src/app/shared/objects/prototypes/asset.model';
import { RoomConnection } from 'src/app/shared/objects/connections/room-connection.model';
import { FullConfigurationItem } from 'src/app/shared/objects/rest-api/full-configuration-item.model';
import { AppConfigService } from 'src/app/shared/app-config.service';
import { Model } from 'src/app/shared/objects/model.model';
import { Room } from 'src/app/shared/objects/asset/room.model';

export class Rack extends Asset {
    maxHeight: number;
    connectionToRoom: RoomConnection;

    constructor(item: FullConfigurationItem, rooms: Room[], models: Model[]) {
        super(item, models);
        if (item) {
            if (item.attributes) {
                const maxHeight = item.attributes.find(a => a.type === AppConfigService.objectModel.AttributeTypeNames.HeightUnits);
                this.maxHeight = maxHeight && Number.parseInt(maxHeight.value, 10) > 0  ? Number.parseInt(maxHeight.value, 10) : 42;
            } else {
                this.maxHeight = 42;
            }
            if (item.connectionsToLower) {
                const conn = item.connectionsToLower.find(c =>
                    c.targetType.toLocaleLowerCase() === AppConfigService.objectModel.ConfigurationItemTypeNames.Room.toLocaleLowerCase()
                );
                if (conn) {
                    const room = rooms.find(r => r.id === conn.targetId);
                    if (room) {
                        this.connectionToRoom = new RoomConnection();
                        this.connectionToRoom.id = conn.id;
                        this.connectionToRoom.room = room;
                        // this.connectionToRoom.rack = this;
                        this.connectionToRoom.connectionType = conn.typeId;
                    }
                }
            }
        }
    }
}
