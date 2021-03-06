import { IConnectionType } from '../mongoose/connection-type.model';

export class ConnectionType {
    id!: string;
    name!: string;
    reverseName!: string;

    constructor(entity?: IConnectionType) {
        if (entity) {
            this.id = entity.id!;
            this.name = entity.name;
            this.reverseName = entity.reverseName;
        }
    }

}
