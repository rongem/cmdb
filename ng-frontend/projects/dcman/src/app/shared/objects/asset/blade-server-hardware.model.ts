import { ProvisioningSystem } from '../prototypes/provisioning-system.mixin';
import { EnclosureMountable } from './enclosure-mountable.model';

const BladeServerProto = ProvisioningSystem(EnclosureMountable);

export class BladeServerHardware extends BladeServerProto {}
