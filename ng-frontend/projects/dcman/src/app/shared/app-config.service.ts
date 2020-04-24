import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AppConfig } from './objects/appsettings/app-config.model';
import { AppObjectModel } from './objects/appsettings/app-object.model';
import { StatusCodes } from './objects/appsettings/status-codes.model';
import { AppConfigService } from 'backend-access';

interface AppSettings {
    ObjectModel: AppObjectModel;
    StatusCodes: StatusCodes;
}

const objectModel: AppObjectModel = {
    AttributeGroupNames: {
        HardwareAttributes: '',
        ModelAttributes: '',
        NetworkAttributes: '',
        RoomAttributes: '',
        ServerAttributes: '',
        StatusAttributes: '',
    },
    AttributeTypeNames: {
        BuildingName: '',
        CpuCount: '',
        Height: '',
        HeightUnits: '',
        Hostname: '',
        IpAddress: '',
        Manufacturer: '',
        MemorySize: '',
        OperatingSystem: '',
        Purpose: '',
        SerialNumber: '',
        Width: '',
        Status: '',
        TargetTypeName: '',
    },
    ConfigurationItemTypeNames: {
        BackupSystem: '',
        BareMetalHypervisor: '',
        BladeAppliance: '',
        BladeEnclosure: '',
        BladeInterconnect: '',
        BladeServerHardware: '',
        HardwareAppliance: '',
        Model: '',
        NetworkSwitch: '',
        PDU: '',
        Rack: '',
        RackServerHardware: '',
        Room: '',
        SanSwitch: '',
        Server: '',
        SoftAppliance: '',
        StorageSystem: '',
    },
    ConnectionTypeNames: {
        BuiltIn: {
            BottomUpName: '',
            TopDownName: '',
        },
        Is: {
            BottomUpName: '',
            TopDownName: '',
        },
        Provisions: {
            BottomUpName: '',
            TopDownName: '',
        },
    },
    OtherText: {
        HeightUnit: '',
        Slot: '',
    }
};

const statusCodes: StatusCodes = {
    Booked: {
        Name: '',
        Color: '',
        Description: '',
    },
    Error: {
        Name: '',
        Color: '',
        Description: '',
    },
    Fault: {
        Name: '',
        Color: '',
        Description: '',
    },
    InProduction: {
        Name: '',
        Color: '',
        Description: '',
    },
    PendingScrap: {
        Name: '',
        Color: '',
        Description: '',
    },
    PrepareForScrap: {
        Name: '',
        Color: '',
        Description: '',
    },
    RepairPending: {
        Name: '',
        Color: '',
        Description: '',
    },
    Scrapped: {
        Name: '',
        Color: '',
        Description: '',
    },
    Stored: {
        Name: '',
        Color: '',
        Description: '',
    },
    Unknown: {
        Name: '',
        Color: '',
        Description: '',
    },
    Unused: {
        Name: '',
        Color: '',
        Description: '',
    },
};

@Injectable({ providedIn: 'root' })
export class ExtendedAppConfigService {
    static settings: AppConfig;
    static objectModel: AppObjectModel;
    static statusCodes: StatusCodes;

    constructor(private http: HttpClient, private config: AppConfigService) { }

    loadSettings() {
        return Promise.all([this.config.load(environment.name), this.loadLanguageSettings()]);
    }

    private loadLanguageSettings() {
        const jsonFile = 'assets/config/settings.json';
        return new Promise<void>((resolve, reject) => {
            this.http.get<AppSettings>(jsonFile).toPromise().then((response: AppSettings) => {
                Object.assign(objectModel.AttributeGroupNames, response.ObjectModel.AttributeGroupNames);
                Object.assign(objectModel.AttributeTypeNames, response.ObjectModel.AttributeTypeNames);
                Object.assign(objectModel.ConfigurationItemTypeNames, response.ObjectModel.ConfigurationItemTypeNames);
                Object.assign(objectModel.OtherText, response.ObjectModel.OtherText);
                const missingValues: string[] = [];
                Object.keys(objectModel).forEach(key => {
                    Object.keys(objectModel[key]).forEach(subkey => {
                        if (subkey !== 'ConnectionTypeNames') {
                            if (!objectModel[key][subkey] || objectModel[key][subkey] === '') {
                                missingValues.push('Missing value in object model: ' + key + '/' + subkey);
                            }
                        }
                    });
                });
                Object.keys(objectModel.ConnectionTypeNames).forEach(key => {
                    Object.assign(objectModel.ConnectionTypeNames[key], response.ObjectModel.ConnectionTypeNames[key]);
                    Object.keys(objectModel.ConnectionTypeNames[key]).forEach(subkey => {
                        if (!objectModel.ConnectionTypeNames[key][subkey] || objectModel.ConnectionTypeNames[key][subkey] === '') {
                            missingValues.push('Missing value in object model: ' + key + '/' + subkey);
                        }
                    });
                });
                Object.getOwnPropertyNames(statusCodes).forEach(key => {
                    if (!statusCodes[key] || statusCodes[key] === '') {
                        missingValues.push('Missing status code: ' + key);
                    }
                });
                if (missingValues.length > 0) {
                    console.log(objectModel);
                    reject(missingValues);
                }
                ExtendedAppConfigService.objectModel = objectModel;
                ExtendedAppConfigService.statusCodes = statusCodes;
                resolve();
            }).catch((response: any) => {
                reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
            });
        });
    }

}
