import { ProvisionedSystem } from 'src/app/shared/objects/asset/provisioned-system.model';

type Constructor<T = {}> = new (...args: any[]) => T;

export function ProvisioningSystem<TBase extends Constructor>(Base: TBase) {
    return class extends Base {
        provisionedSystem: ProvisionedSystem;
    };
}
