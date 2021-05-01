/* eslint-disable @typescript-eslint/naming-convention */

export interface ConnectionTypeTemplate {
    topDownName: string;
    bottomUpName: string;
}

export interface AppObjectModel {
    ConfigurationItemTypeNames: {
        BackupSystem: string;
        BareMetalHypervisor: string;
        BladeAppliance: string;
        BladeEnclosure: string;
        BladeInterconnect: string;
        BladeServerHardware: string;
        BladeStorage: string;
        HardwareAppliance: string;
        Model: string;
        NetworkSwitch: string;
        PDU: string;
        Rack: string;
        RackServerHardware: string;
        Room: string;
        SanSwitch: string;
        Server: string;
        SoftAppliance: string;
        StorageSystem: string;
    };
    ConnectionTypeNames: {
        BuiltIn: ConnectionTypeTemplate;
        Provisions: ConnectionTypeTemplate;
        Is: ConnectionTypeTemplate;
    };
    AttributeTypeNames: {
        BackSideSlots: string;
        BuildingName: string;
        Height: string;
        HeightUnits: string;
        Hostname: string;
        IpAddress: string;
        Manufacturer: string;
        SerialNumber: string;
        Width: string;
        Status: string;
        TargetTypeName: string;
    };
    AttributeGroupNames: {
        HardwareAttributes: string;
        ModelAttributes: string;
        NetworkAttributes: string;
        RoomAttributes: string;
        ServerAttributes: string;
        StatusAttributes: string;
    };
    OtherText: {
        HeightUnit: string;
        Slot: string;
    };
}
