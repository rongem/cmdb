import { Injectable } from '@angular/core';

import { FullConfigurationItem } from '../objects/rest-api/full-configuration-item.model';
import { Room } from '../objects/asset/room.model';
import { Rack } from '../objects/asset/rack.model';

@Injectable({providedIn: 'root'})
export class ConverterService {
    convertToRooms(items: FullConfigurationItem[]) {
        return items.map(item => new Room(item));
    }

    converttoRacks(items: FullConfigurationItem[]) {
        return items.map(item => new Rack(item));
    }
}
