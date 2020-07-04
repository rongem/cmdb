import { ExtendedAppConfigService } from '../../app-config.service';
import { ConnectionTypeTemplate } from './app-object.model';
import { Mappings } from './mappings.model';

export interface RuleTemplate {
    connectionType: ConnectionTypeTemplate;
    maxConnectionsTopDown: number;
    maxConnectionsBottomUp: number;
    validationExpression: string;
    upperItemNames: string[];
    lowerItemNames: string[];
}

export class RuleSettings {
    connectionsToRoom: RuleTemplate = {
        connectionType:  ExtendedAppConfigService.objectModel.ConnectionTypeNames.BuiltIn,
        maxConnectionsTopDown: 1,
        maxConnectionsBottomUp: 100,
        validationExpression: '^.*$',
        upperItemNames: [ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Rack],
        lowerItemNames: [ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Room],
    };

    connectionsToRack: RuleTemplate = {
        connectionType: ExtendedAppConfigService.objectModel.ConnectionTypeNames.BuiltIn,
        maxConnectionsTopDown: 1,
        maxConnectionsBottomUp: 50,
        validationExpression: '^' + ExtendedAppConfigService.objectModel.OtherText.HeightUnit + '\: ?[1-9][0-9]?(-[1-9][0-9]?)?$',
        upperItemNames: Mappings.rackMountables,
        lowerItemNames: [ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Rack],
    };

    connectionsToEnclosure: RuleTemplate = {
        connectionType: ExtendedAppConfigService.objectModel.ConnectionTypeNames.BuiltIn,
        maxConnectionsTopDown: 1,
        maxConnectionsBottomUp: 50,
        validationExpression: '^' + ExtendedAppConfigService.objectModel.OtherText.Slot + '\: ?[1-9][0-9]?$',
        upperItemNames: Mappings.enclosureMountables,
        lowerItemNames: [ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BladeEnclosure],
    };

    hardwareToModel: RuleTemplate = {
        connectionType: ExtendedAppConfigService.objectModel.ConnectionTypeNames.Is,
        maxConnectionsTopDown: 1,
        maxConnectionsBottomUp: 9999,
        validationExpression: '^.*$',
        upperItemNames: Mappings.assets,
        lowerItemNames: [ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Model],
    };

    provisioning: RuleTemplate = {
        connectionType: ExtendedAppConfigService.objectModel.ConnectionTypeNames.Provisions,
        maxConnectionsTopDown: 1,
        maxConnectionsBottomUp: 1,
        validationExpression: '^.*$',
        upperItemNames: Mappings.provisionedSystems,
        lowerItemNames: Mappings.installableSystems,
    };
}
