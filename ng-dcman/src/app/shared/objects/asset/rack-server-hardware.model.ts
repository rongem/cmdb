import { ProvisioningSystem } from 'src/app/shared/objects/prototypes/provisioning-system.mixin';
import { RackMountable } from 'src/app/shared/objects/asset/rack-mountable.model';

const RackServerProto = ProvisioningSystem(RackMountable);

export class RackServerHardware extends RackServerProto {}

