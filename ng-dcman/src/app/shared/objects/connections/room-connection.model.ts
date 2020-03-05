import { Guid } from 'src/app/shared/guid';
import { Room } from 'src/app/shared/objects/asset/room.model';
// import { Rack } from 'src/app/shared/objects/asset/rack.model';

export class RoomConnection {
    id: Guid;
    // rack: Rack;
    room: Room;
    connectionType: Guid;
}
