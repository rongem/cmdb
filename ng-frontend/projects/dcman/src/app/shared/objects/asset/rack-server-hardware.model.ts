import { ProvisioningSystem } from '../prototypes/provisioning-system.mixin';
import { RackMountable } from './rack-mountable.model';

const RackServerProto = ProvisioningSystem(RackMountable);

export class RackServerHardware extends RackServerProto {}

