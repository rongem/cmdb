import { Injectable } from '@angular/core';

import { FullConfigurationItem } from '../objects/rest-api/full-configuration-item.model';
import { Room } from '../objects/asset/room.model';
import { Rack } from '../objects/asset/rack.model';
import { Model } from '../objects/model.model';
import { BladeEnclosure } from '../objects/asset/blade-enclosure.model';
import { RackMountable } from '../objects/rack-mountable.model';

@Injectable({providedIn: 'root'})
export class ConverterService {
    convertToRooms(items: FullConfigurationItem[]) {
        return items.map(item => new Room(item));
    }

    convertToModels(items: FullConfigurationItem[]) {
        return items.map(item => new Model(item));
    }

    convertToRacks(items: FullConfigurationItem[], rooms: Room[], models: Model[]) {
        return items.map(item => new Rack(item, rooms, models));
    }

    convertToEnclosures(items: FullConfigurationItem[], racks: Rack[], models: Model[]) {
        return items.map(item => new BladeEnclosure(item, racks, models));
    }

    convertToRackMountable(items: FullConfigurationItem[], racks: Rack[], models: Model[]) {
        return items.map(item => new RackMountable(item, racks, models));
    }
}
