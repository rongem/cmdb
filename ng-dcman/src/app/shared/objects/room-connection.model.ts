import { Guid } from '../guid';
import { Room } from './asset/room.model';
import { Rack } from './asset/rack.model';
import { FullConfigurationItem } from './rest-api/full-configuration-item.model';
import { AppConfigService } from '../app-config.service';

export class RoomConnection {
    id: Guid;
    // rack: Rack;
    room: Room;
    connectionType: Guid;

    constructor(item?: FullConfigurationItem, rooms?: Room[]) { // rack: Rack,
        if (item && item.connectionsToLower && rooms) {
            // this.rack = rack;
            const conn = item.connectionsToLower.find(c =>
                c.targetType.toLocaleLowerCase() === AppConfigService.objectModel.ConfigurationItemTypeNames.Room
            );
            if (conn) {
                this.room = rooms.find(r => r.id === conn.targetId);
                this.id = conn.id;
                this.connectionType = conn.typeId;
            }
        }
    }
}
