import { ProvisionedSystem } from '../asset/provisioned-system.model';

type Constructor<T = {}> = new (...args: any[]) => T;

export function ProvisioningSystem<TBase extends Constructor>(Base: TBase) {
    return class extends Base {
        provisionedSystem: ProvisionedSystem;
    };
}
