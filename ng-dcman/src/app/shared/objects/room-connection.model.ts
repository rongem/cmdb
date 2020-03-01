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
}
