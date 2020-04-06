import { Guid } from '../../guid';
import { Room } from '../asset/room.model';
// import { Rack } from '../asset/rack.model';

export class RoomConnection {
    id: Guid;
    // rack: Rack;
    room: Room;
    connectionType: Guid;
}
