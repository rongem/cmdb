import { Injectable } from '@angular/core';
import { FullConfigurationItem } from 'backend-access';

import { Room } from '../objects/asset/room.model';
import { Rack } from '../objects/asset/rack.model';
import { Model } from '../objects/model.model';
import { BladeEnclosure } from '../objects/asset/blade-enclosure.model';
import { RackMountable } from '../objects/asset/rack-mountable.model';
import { RackServerHardware } from '../objects/asset/rack-server-hardware.model';
import { BladeServerHardware } from '../objects/asset/blade-server-hardware.model';
import { EnclosureMountable } from '../objects/asset/enclosure-mountable.model';
import { RuleStore } from '../objects/appsettings/rule-store.model';

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

    convertToRackServerHardware(items: FullConfigurationItem[], racks: Rack[], models: Model[], rulesStore?: RuleStore[]) {
        return items.map(item => new RackServerHardware(item, racks, models, rulesStore));
    }

    convertToRackMountable(items: FullConfigurationItem[], racks: Rack[], models: Model[]) {
        return items.map(item => new RackMountable(item, racks, models));
    }

    convertToBladeServerHardware(items: FullConfigurationItem[], enclosures: BladeEnclosure[], models: Model[], rulesStore?: RuleStore[]) {
        return items.map(item => new BladeServerHardware(item, enclosures, models, rulesStore));
    }

    convertToEnclosureMountable(items: FullConfigurationItem[], enclosures: BladeEnclosure[], models: Model[]) {
        return items.map(item => new EnclosureMountable(item, enclosures, models));
    }
}
