export class AppObjectModel {
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
        BuiltIn: {
            TopDownName: string;
            BottomUpName: string;
        };
        Provisions: {
            TopDownName: string;
            BottomUpName: string;
        };
        Is: {
            TopDownName: string;
            BottomUpName: string;
        }
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
    };
    AttributeGroupNames: {
        HardwareAttributes: string;
        NetworkAttributes: string;
        MountingAttributes: string;
        RoomAttributes: string;
        ServerAttributes: string;
        StatusAttributes: string;
    };
}
