import { AppConfigService } from '../../app-config.service';
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
        connectionType:  AppConfigService.objectModel.ConnectionTypeNames.BuiltIn,
        maxConnectionsTopDown: 1,
        maxConnectionsBottomUp: 100,
        validationExpression: '^.*$',
        upperItemNames: [AppConfigService.objectModel.ConfigurationItemTypeNames.Rack],
        lowerItemNames: [AppConfigService.objectModel.ConfigurationItemTypeNames.Room],
    };

    connectionsToRack: RuleTemplate = {
        connectionType: AppConfigService.objectModel.ConnectionTypeNames.BuiltIn,
        maxConnectionsTopDown: 1,
        maxConnectionsBottomUp: 50,
        validationExpression: '^' + AppConfigService.objectModel.OtherText.HeightUnit + '\: ?[1-9][0-9]?(-[1-9][0-9]?)?$',
        upperItemNames: [
            AppConfigService.objectModel.ConfigurationItemTypeNames.BackupSystem,
            AppConfigService.objectModel.ConfigurationItemTypeNames.BladeEnclosure,
            AppConfigService.objectModel.ConfigurationItemTypeNames.HardwareAppliance,
            AppConfigService.objectModel.ConfigurationItemTypeNames.NetworkSwitch,
            AppConfigService.objectModel.ConfigurationItemTypeNames.PDU,
            AppConfigService.objectModel.ConfigurationItemTypeNames.RackServerHardware,
            AppConfigService.objectModel.ConfigurationItemTypeNames.SanSwitch,
            AppConfigService.objectModel.ConfigurationItemTypeNames.StorageSystem,
        ],
        lowerItemNames: [AppConfigService.objectModel.ConfigurationItemTypeNames.Rack],
    };

    connectionsToEnclosure: RuleTemplate = {
        connectionType: AppConfigService.objectModel.ConnectionTypeNames.BuiltIn,
        maxConnectionsTopDown: 1,
        maxConnectionsBottomUp: 50,
        validationExpression: '^' + AppConfigService.objectModel.OtherText.Slot + '\: ?[1-9][0-9]?$',
        upperItemNames: [
            AppConfigService.objectModel.ConfigurationItemTypeNames.BladeAppliance,
            AppConfigService.objectModel.ConfigurationItemTypeNames.BladeInterconnect,
            AppConfigService.objectModel.ConfigurationItemTypeNames.BladeServerHardware,
        ],
        lowerItemNames: [AppConfigService.objectModel.ConfigurationItemTypeNames.BladeEnclosure],
    };

    hardwareToModel: RuleTemplate = {
        connectionType: AppConfigService.objectModel.ConnectionTypeNames.Is,
        maxConnectionsTopDown: 1,
        maxConnectionsBottomUp: 9999,
        validationExpression: '^.*$',
        upperItemNames: [
            AppConfigService.objectModel.ConfigurationItemTypeNames.BackupSystem,
            AppConfigService.objectModel.ConfigurationItemTypeNames.BladeAppliance,
            AppConfigService.objectModel.ConfigurationItemTypeNames.BladeEnclosure,
            AppConfigService.objectModel.ConfigurationItemTypeNames.BladeInterconnect,
            AppConfigService.objectModel.ConfigurationItemTypeNames.BladeServerHardware,
            AppConfigService.objectModel.ConfigurationItemTypeNames.HardwareAppliance,
            AppConfigService.objectModel.ConfigurationItemTypeNames.NetworkSwitch,
            AppConfigService.objectModel.ConfigurationItemTypeNames.PDU,
            AppConfigService.objectModel.ConfigurationItemTypeNames.RackServerHardware,
            AppConfigService.objectModel.ConfigurationItemTypeNames.SanSwitch,
            AppConfigService.objectModel.ConfigurationItemTypeNames.StorageSystem,
        ],
        lowerItemNames: [AppConfigService.objectModel.ConfigurationItemTypeNames.Model],
    };

    provisioning: RuleTemplate = {
        connectionType: AppConfigService.objectModel.ConnectionTypeNames.Provisions,
        maxConnectionsTopDown: 1,
        maxConnectionsBottomUp: 1,
        validationExpression: '^.*$',
        upperItemNames: [
            AppConfigService.objectModel.ConfigurationItemTypeNames.BareMetalHypervisor,
            AppConfigService.objectModel.ConfigurationItemTypeNames.Server,
            AppConfigService.objectModel.ConfigurationItemTypeNames.SoftAppliance,
        ],
        lowerItemNames: [
            AppConfigService.objectModel.ConfigurationItemTypeNames.BladeServerHardware,
            AppConfigService.objectModel.ConfigurationItemTypeNames.RackServerHardware,
        ],
    };
}
