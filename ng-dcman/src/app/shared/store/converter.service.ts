import { Injectable } from '@angular/core';

import { FullConfigurationItem } from 'src/app/shared/objects/rest-api/full-configuration-item.model';
import { Room } from 'src/app/shared/objects/asset/room.model';
import { Rack } from 'src/app/shared/objects/asset/rack.model';
import { Model } from 'src/app/shared/objects/model.model';
import { BladeEnclosure } from 'src/app/shared/objects/asset/blade-enclosure.model';
import { RackMountable } from 'src/app/shared/objects/asset/rack-mountable.model';
import { RackServerHardware } from 'src/app/shared/objects/asset/rack-server-hardware.model';
import { BladeServerHardware } from 'src/app/shared/objects/asset/blade-server-hardware.model';

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

    convertToRackServerHardware(items: FullConfigurationItem[], racks: Rack[], models: Model[]) {
        return items.map(item => new RackServerHardware(item, racks, models));
    }

    convertToBladeServerHardware(items: FullConfigurationItem[], enclosures: BladeEnclosure[], models: Model[]) {
        return items.map(item => new BladeServerHardware(item, enclosures, models));
    }
    convertToRackMountable(items: FullConfigurationItem[], racks: Rack[], models: Model[]) {
        return items.map(item => new RackMountable(item, racks, models));
    }
}
