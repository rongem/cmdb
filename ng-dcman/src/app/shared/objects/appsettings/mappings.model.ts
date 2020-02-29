import { AttributeGroupMapping } from './attribute-group-mapping.model';
import { AppConfigService } from '../../app-config.service';

export class Mappings {
    private attributeGroupsForTypes$: Map<string, string>;

    get attributeGroupsForAttributeType() {
        if (!this.attributeGroupsForTypes$) {
            this.attributeGroupsForTypes$ = new Map();
            Object.getOwnPropertyNames(this).forEach(key => {
                if (this[key] instanceof AttributeGroupMapping) {
                    const map = this[key] as AttributeGroupMapping;
                    map.attributeTypeNames.forEach(value =>
                        this.attributeGroupsForTypes$.set(value.toLocaleLowerCase(), map.attributeGroupName.toLocaleLowerCase()));
                }
            });
        }
        return this.attributeGroupsForTypes$;
    }

    hardwareAttributes = new AttributeGroupMapping(
        AppConfigService.objectModel.AttributeGroupNames.HardwareAttributes,
        [
            AppConfigService.objectModel.AttributeTypeNames.SerialNumber,
        ],
        [
            AppConfigService.objectModel.ConfigurationItemTypeNames.BackupSystem,
            AppConfigService.objectModel.ConfigurationItemTypeNames.BladeAppliance,
            AppConfigService.objectModel.ConfigurationItemTypeNames.BladeEnclosure,
            AppConfigService.objectModel.ConfigurationItemTypeNames.BladeInterconnect,
            AppConfigService.objectModel.ConfigurationItemTypeNames.BladeServerHardware,
            AppConfigService.objectModel.ConfigurationItemTypeNames.HardwareAppliance,
            AppConfigService.objectModel.ConfigurationItemTypeNames.NetworkSwitch,
            AppConfigService.objectModel.ConfigurationItemTypeNames.PDU,
            AppConfigService.objectModel.ConfigurationItemTypeNames.Rack,
            AppConfigService.objectModel.ConfigurationItemTypeNames.RackServerHardware,
            AppConfigService.objectModel.ConfigurationItemTypeNames.SanSwitch,
            AppConfigService.objectModel.ConfigurationItemTypeNames.StorageSystem,
        ]
    );

    modelAttributes = new AttributeGroupMapping(
        AppConfigService.objectModel.AttributeGroupNames.ModelAttributes,
        [
            AppConfigService.objectModel.AttributeTypeNames.Manufacturer,
            AppConfigService.objectModel.AttributeTypeNames.Size,
            AppConfigService.objectModel.AttributeTypeNames.TargetTypeName,
        ],
        [
            AppConfigService.objectModel.ConfigurationItemTypeNames.Model,
        ]
    );

    networkAttributes = new AttributeGroupMapping(
        AppConfigService.objectModel.AttributeGroupNames.NetworkAttributes,
        [
            AppConfigService.objectModel.AttributeTypeNames.Hostname,
            AppConfigService.objectModel.AttributeTypeNames.IpAddress,
        ],
        [
            AppConfigService.objectModel.ConfigurationItemTypeNames.BackupSystem,
            AppConfigService.objectModel.ConfigurationItemTypeNames.BareMetalHypervisor,
            AppConfigService.objectModel.ConfigurationItemTypeNames.BladeAppliance,
            AppConfigService.objectModel.ConfigurationItemTypeNames.BladeEnclosure,
            AppConfigService.objectModel.ConfigurationItemTypeNames.BladeInterconnect,
            AppConfigService.objectModel.ConfigurationItemTypeNames.BladeServerHardware,
            AppConfigService.objectModel.ConfigurationItemTypeNames.HardwareAppliance,
            AppConfigService.objectModel.ConfigurationItemTypeNames.NetworkSwitch,
            AppConfigService.objectModel.ConfigurationItemTypeNames.PDU,
            AppConfigService.objectModel.ConfigurationItemTypeNames.Rack,
            AppConfigService.objectModel.ConfigurationItemTypeNames.RackServerHardware,
            AppConfigService.objectModel.ConfigurationItemTypeNames.SanSwitch,
            AppConfigService.objectModel.ConfigurationItemTypeNames.Server,
            AppConfigService.objectModel.ConfigurationItemTypeNames.SoftAppliance,
            AppConfigService.objectModel.ConfigurationItemTypeNames.StorageSystem,
        ]
    );


    roomAttributes = new AttributeGroupMapping(
        AppConfigService.objectModel.AttributeGroupNames.RoomAttributes,
        [
            AppConfigService.objectModel.AttributeTypeNames.BuildingName,
        ],
        [
            AppConfigService.objectModel.ConfigurationItemTypeNames.Room,
        ]
    );

    serverAttributes = new AttributeGroupMapping(
        AppConfigService.objectModel.AttributeGroupNames.ServerAttributes,
        [
            AppConfigService.objectModel.AttributeTypeNames.CpuCount,
            AppConfigService.objectModel.AttributeTypeNames.MemorySize,
            AppConfigService.objectModel.AttributeTypeNames.OperatingSystem,
            AppConfigService.objectModel.AttributeTypeNames.Purpose,
        ],
        [
            AppConfigService.objectModel.ConfigurationItemTypeNames.HardwareAppliance,
            AppConfigService.objectModel.ConfigurationItemTypeNames.Server,
            AppConfigService.objectModel.ConfigurationItemTypeNames.SoftAppliance,
        ]
    );

    statusAttributes = new AttributeGroupMapping(
        AppConfigService.objectModel.AttributeGroupNames.StatusAttributes,
        [
            AppConfigService.objectModel.AttributeTypeNames.Status,
        ],
        [
            AppConfigService.objectModel.ConfigurationItemTypeNames.BackupSystem,
            AppConfigService.objectModel.ConfigurationItemTypeNames.BareMetalHypervisor,
            AppConfigService.objectModel.ConfigurationItemTypeNames.BladeAppliance,
            AppConfigService.objectModel.ConfigurationItemTypeNames.BladeEnclosure,
            AppConfigService.objectModel.ConfigurationItemTypeNames.BladeInterconnect,
            AppConfigService.objectModel.ConfigurationItemTypeNames.BladeServerHardware,
            AppConfigService.objectModel.ConfigurationItemTypeNames.HardwareAppliance,
            AppConfigService.objectModel.ConfigurationItemTypeNames.NetworkSwitch,
            AppConfigService.objectModel.ConfigurationItemTypeNames.PDU,
            AppConfigService.objectModel.ConfigurationItemTypeNames.Rack,
            AppConfigService.objectModel.ConfigurationItemTypeNames.RackServerHardware,
            AppConfigService.objectModel.ConfigurationItemTypeNames.SanSwitch,
            AppConfigService.objectModel.ConfigurationItemTypeNames.Server,
            AppConfigService.objectModel.ConfigurationItemTypeNames.SoftAppliance,
            AppConfigService.objectModel.ConfigurationItemTypeNames.StorageSystem,
        ]
    );

    getAttributeGroupsForItemType(itemTypeName: string) {
        const groups: string[] = [];
        Object.getOwnPropertyNames(this).forEach(key => {
            if (this[key] instanceof AttributeGroupMapping) {
                const map = this[key] as AttributeGroupMapping;
                if (map.itemTypeNames.map(value => value.toLocaleLowerCase()).includes(itemTypeName.toLocaleLowerCase())) {
                    groups.push(map.attributeGroupName);
                }
            }
        });
        return groups;
    }
}
