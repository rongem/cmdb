import { ExtendedAppConfigService } from '../../app-config.service';
import { ConnectionTypeTemplate } from './app-object.model';

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
        upperItemNames: [
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BackupSystem,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BladeEnclosure,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.HardwareAppliance,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.NetworkSwitch,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.PDU,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.RackServerHardware,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.SanSwitch,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.StorageSystem,
        ],
        lowerItemNames: [ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Rack],
    };

    connectionsToEnclosure: RuleTemplate = {
        connectionType: ExtendedAppConfigService.objectModel.ConnectionTypeNames.BuiltIn,
        maxConnectionsTopDown: 1,
        maxConnectionsBottomUp: 50,
        validationExpression: '^' + ExtendedAppConfigService.objectModel.OtherText.Slot + '\: ?[1-9][0-9]?$',
        upperItemNames: [
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BladeAppliance,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BladeInterconnect,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BladeServerHardware,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BladeStorage,
        ],
        lowerItemNames: [ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BladeEnclosure],
    };

    hardwareToModel: RuleTemplate = {
        connectionType: ExtendedAppConfigService.objectModel.ConnectionTypeNames.Is,
        maxConnectionsTopDown: 1,
        maxConnectionsBottomUp: 9999,
        validationExpression: '^.*$',
        upperItemNames: [
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BackupSystem,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BladeAppliance,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BladeEnclosure,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BladeInterconnect,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BladeServerHardware,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BladeStorage,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.HardwareAppliance,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.NetworkSwitch,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.PDU,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Rack,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.RackServerHardware,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.SanSwitch,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.StorageSystem,
        ],
        lowerItemNames: [ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Model],
    };

    provisioning: RuleTemplate = {
        connectionType: ExtendedAppConfigService.objectModel.ConnectionTypeNames.Provisions,
        maxConnectionsTopDown: 1,
        maxConnectionsBottomUp: 1,
        validationExpression: '^.*$',
        upperItemNames: [
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BareMetalHypervisor,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Server,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.SoftAppliance,
        ],
        lowerItemNames: [
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BladeServerHardware,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.RackServerHardware,
        ],
    };
}
