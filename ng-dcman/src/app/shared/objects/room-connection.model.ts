import { Guid } from '../guid';
import { Room } from './assets/room.model';
import { Rack } from './assets/rack.model';

export class RoomConnection {
    id: Guid;
    rack: Rack;
    room: Room;
    connectionType: Guid;
}
