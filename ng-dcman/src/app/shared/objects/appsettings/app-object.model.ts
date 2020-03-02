import { ConnectionType } from '../rest-api/connection-type.model';

export interface ConnectionTypeTemplate {
    TopDownName: string;
    BottomUpName: string;
}

export interface AppObjectModel {
    ConfigurationItemTypeNames: {
        BackupSystem: string;
        BareMetalHypervisor: string;
        BladeAppliance: string;
        BladeEnclosure: string;
        BladeInterconnect: string;
        BladeServerHardware: string;
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
        BuildingName: string;
        CpuCount: string;
        Hostname: string;
        IpAddress: string;
        Manufacturer: string;
        MemorySize: string;
        OperatingSystem: string;
        Purpose: string;
        SerialNumber: string;
        Size: string;
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
