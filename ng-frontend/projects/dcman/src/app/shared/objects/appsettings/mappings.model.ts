import { AttributeGroupMapping } from './attribute-group-mapping.model';
import { ExtendedAppConfigService } from '../../app-config.service';

export class Mappings {
    hardwareAttributes = new AttributeGroupMapping(
        ExtendedAppConfigService.objectModel.AttributeGroupNames.HardwareAttributes,
        [
            ExtendedAppConfigService.objectModel.AttributeTypeNames.SerialNumber,
        ],
        [
            ...Mappings.assets
        ]
    );

    modelAttributes = new AttributeGroupMapping(
        ExtendedAppConfigService.objectModel.AttributeGroupNames.ModelAttributes,
        [
            ExtendedAppConfigService.objectModel.AttributeTypeNames.BackSideSlots,
            ExtendedAppConfigService.objectModel.AttributeTypeNames.Height,
            ExtendedAppConfigService.objectModel.AttributeTypeNames.HeightUnits,
            ExtendedAppConfigService.objectModel.AttributeTypeNames.Manufacturer,
            ExtendedAppConfigService.objectModel.AttributeTypeNames.Width,
            ExtendedAppConfigService.objectModel.AttributeTypeNames.TargetTypeName,
        ],
        [
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Model,
        ]
    );

    networkAttributes = new AttributeGroupMapping(
        ExtendedAppConfigService.objectModel.AttributeGroupNames.NetworkAttributes,
        [
            ExtendedAppConfigService.objectModel.AttributeTypeNames.Hostname,
            ExtendedAppConfigService.objectModel.AttributeTypeNames.IpAddress,
        ],
        [
            ...Mappings.assets, ...Mappings.provisionedSystems
        ]
    );


    roomAttributes = new AttributeGroupMapping(
        ExtendedAppConfigService.objectModel.AttributeGroupNames.RoomAttributes,
        [
            ExtendedAppConfigService.objectModel.AttributeTypeNames.BuildingName,
        ],
        [
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Room,
        ]
    );

    statusAttributes = new AttributeGroupMapping(
        ExtendedAppConfigService.objectModel.AttributeGroupNames.StatusAttributes,
        [
            ExtendedAppConfigService.objectModel.AttributeTypeNames.Status,
        ],
        [
            ...Mappings.assets
        ]
    );

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

    static get rackMountables() {
        return [
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BackupSystem,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BladeEnclosure,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.HardwareAppliance,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.NetworkSwitch,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.PDU,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.RackServerHardware,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.SanSwitch,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.StorageSystem,
        ].map(rm => rm.toLocaleLowerCase());
    }

    static get enclosureMountables() {
        return [
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BladeServerHardware,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BladeAppliance,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BladeInterconnect,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BladeStorage,
        ].map(rm => rm.toLocaleLowerCase());
    }

    static get enclosureBackSideMountables() {
        return [
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BladeAppliance,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BladeInterconnect,
        ].map(rm => rm.toLocaleLowerCase());
    }

    static get installableSystems() {
        return [
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.RackServerHardware,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BladeServerHardware,
        ].map(ps => ps.toLocaleLowerCase());
    }

    static get assets() {
        return [ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Rack.toLocaleLowerCase(),
            ...this.rackMountables,
            ...this.enclosureMountables,
        ];
    }

    static get provisionedSystems() {
        return [
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BareMetalHypervisor,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Server,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.SoftAppliance,
        ].map(ps => ps.toLocaleLowerCase());
    }

    static getValidationExpressionForAttributeType(attributeTypeName: string) {
        const mapping = {
            [ExtendedAppConfigService.objectModel.AttributeTypeNames.BackSideSlots.toLocaleLowerCase()]: '^[0-9]+$',
            [ExtendedAppConfigService.objectModel.AttributeTypeNames.Height.toLocaleLowerCase()]: '^[0-9]+$',
            [ExtendedAppConfigService.objectModel.AttributeTypeNames.HeightUnits.toLocaleLowerCase()]: '^[0-9]+$',
            [ExtendedAppConfigService.objectModel.AttributeTypeNames.Width.toLocaleLowerCase()]: '^[0-9]+$',
        };
        if (mapping[attributeTypeName.toLocaleLowerCase()]) {
            return mapping[attributeTypeName.toLocaleLowerCase()];
        }
        return '^.*$';
    }

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
