import { ProvisioningSystem } from 'src/app/shared/objects/prototypes/provisioning-system.mixin';
import { EnclosureMountable } from 'src/app/shared/objects/asset/enclosure-mountable.model';

const BladeServerProto = ProvisioningSystem(EnclosureMountable);

export class BladeServerHardware extends BladeServerProto {}