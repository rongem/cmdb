import { ProvisionedSystem } from '../asset/provisioned-system.model';
import { FullConfigurationItem } from 'backend-access';
import { Mappings } from '../appsettings/mappings.model';
import { findRule } from '../../store/functions';
import { RuleStore } from '../appsettings/rule-store.model';
import { ExtendedAppConfigService } from '../../app-config.service';

type Constructor<T = {}> = new (...args: any[]) => T;

export function ProvisioningSystem<TBase extends Constructor>(Base: TBase) {
    return class extends Base {
        provisionedSystem: ProvisionedSystem;

        trySetProvisionedSystem(item: FullConfigurationItem, rulesStores: RuleStore[]) {
            item?.connectionsToUpper?.forEach(c => {
                if (Mappings.provisionedSystems.includes(c.targetType.toLocaleLowerCase())) {
                    const rulesStore = findRule(rulesStores, ExtendedAppConfigService.objectModel.ConnectionTypeNames.Provisions,
                        c.targetType, item.type);
                    if (!!rulesStore) {
                        this.provisionedSystem = new ProvisionedSystem();
                        this.provisionedSystem.id = c.targetId;
                        this.provisionedSystem.name = c.targetName;
                        this.provisionedSystem.typeName = c.targetType;
                        this.provisionedSystem.connectionId = c.id;
                        return;
                    }
                }
            });
        }
    };
}
