import { FullConfigurationItem } from 'backend-access';

import { ProvisioningSystem } from '../prototypes/provisioning-system.mixin';
import { RackMountable } from './rack-mountable.model';
import { Rack } from './rack.model';
import { Model } from '../model.model';
import { RuleStore } from '../appsettings/rule-store.model';

const RackServerProto = ProvisioningSystem(RackMountable);

export class RackServerHardware extends RackServerProto {
    constructor(item: FullConfigurationItem, racks?: Rack[], models?: Model[], rulesStore?: RuleStore[]) {
        super(item, racks, models);
        this.trySetProvisionedSystem(item, rulesStore);
    }
}

