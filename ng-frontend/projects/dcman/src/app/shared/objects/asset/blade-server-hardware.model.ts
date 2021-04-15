import { FullConfigurationItem } from 'backend-access';

import { EnclosureMountable } from './enclosure-mountable.model';
import { ProvisioningSystem } from '../prototypes/provisioning-system.mixin';
import { BladeEnclosure } from './blade-enclosure.model';
import { Model } from '../model.model';
import { RuleStore } from '../appsettings/rule-store.model';

// eslint-disable-next-line @typescript-eslint/naming-convention
const BladeServerProto = ProvisioningSystem(EnclosureMountable);

export class BladeServerHardware extends BladeServerProto {
    constructor(item?: FullConfigurationItem, enclosures?: BladeEnclosure[], models?: Model[], rulesStore?: RuleStore[]) {
        super(item, enclosures, models);
        this.trySetProvisionedSystem(item, rulesStore);
    }
}
