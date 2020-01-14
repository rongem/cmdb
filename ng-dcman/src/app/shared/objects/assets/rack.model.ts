import { Asset } from '../asset.model';
import { RoomConnection } from '../room-connection.model';

export class Rack extends Asset {
    maxHeight: number;
    connectionToRoom: RoomConnection;
}
