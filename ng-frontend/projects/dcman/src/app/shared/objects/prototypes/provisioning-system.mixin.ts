/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { ProvisionedSystem } from '../asset/provisioned-system.model';
import { FullConfigurationItem } from 'backend-access';
import { Mappings } from '../appsettings/mappings.model';
import { findRule, llc } from '../../store/functions';
import { RuleStore } from '../appsettings/rule-store.model';
import { ExtendedAppConfigService } from '../../app-config.service';

// eslint-disable-next-line @typescript-eslint/ban-types
type Constructor<T = {}> = new (...args: any[]) => T;

export function ProvisioningSystem<TBase extends Constructor>(Base: TBase) {
    return class extends Base {
        provisionedSystem: ProvisionedSystem;

        trySetProvisionedSystem(item: FullConfigurationItem, rulesStores: RuleStore[]) {
            item?.connectionsToUpper?.forEach(c => {
                if (Mappings.provisionedSystems.includes(llc(c.targetType))) {
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
