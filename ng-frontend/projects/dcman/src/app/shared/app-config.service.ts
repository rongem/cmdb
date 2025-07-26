/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AppObjectModel } from './objects/appsettings/app-object.model';
import { StatusCodes } from './objects/appsettings/status-codes.model';
import { AppConfigService } from 'backend-access';
import { AssetStatus } from './objects/asset/asset-status.enum';
import { lastValueFrom } from 'rxjs';

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
        BackSideSlots: '',
        BuildingName: '',
        Height: '',
        HeightUnits: '',
        Hostname: '',
        IpAddress: '',
        Manufacturer: '',
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
        BladeStorage: '',
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
            bottomUpName: '',
            topDownName: '',
        },
        Is: {
            bottomUpName: '',
            topDownName: '',
        },
        Provisions: {
            bottomUpName: '',
            topDownName: '',
        },
    },
    OtherText: {
        HeightUnit: '',
        Slot: '',
    }
};

const statusCodes: StatusCodes = {
    Booked: {
        code: AssetStatus.Booked,
        name: '',
        color: '',
        description: '',
    },
    Fault: {
        code: AssetStatus.Fault,
        name: '',
        color: '',
        description: '',
    },
    InProduction: {
        code: AssetStatus.InProduction,
        name: '',
        color: '',
        description: '',
    },
    PendingScrap: {
        code: AssetStatus.PendingScrap,
        name: '',
        color: '',
        description: '',
    },
    PrepareForScrap: {
        code: AssetStatus.PrepareForScrap,
        name: '',
        color: '',
        description: '',
    },
    RepairPending: {
        code: AssetStatus.RepairPending,
        name: '',
        color: '',
        description: '',
    },
    Scrapped: {
        code: AssetStatus.Scrapped,
        name: '',
        color: '',
        description: '',
    },
    Stored: {
        code: AssetStatus.Stored,
        name: '',
        color: '',
        description: '',
    },
    Unknown: {
        code: AssetStatus.Unknown,
        name: '',
        color: '',
        description: '',
    },
    Unused: {
        code: AssetStatus.Unused,
        name: '',
        color: '',
        description: '',
    },
};

@Injectable({ providedIn: 'root' })
export class ExtendedAppConfigService extends AppConfigService {
    static objectModel: AppObjectModel;
    static statusCodes: StatusCodes;

    loadSettings() {
        return Promise.all([this.load(), this.loadLanguageSettings()]);
    }

    private loadLanguageSettings() {
        const jsonFile = 'assets/config/settings.json';
        return new Promise<void>((resolve, reject) => {
            lastValueFrom(this.http.get<AppSettings>(jsonFile)).then((response: AppSettings) => {
                const missingValues: string[] = [];
                Object.keys(objectModel).forEach(key => {
                    Object.keys(objectModel[key]).forEach(subkey => {
                        if (subkey !== 'ConnectionTypeNames') {
                            if (!response.ObjectModel[key][subkey] || response.ObjectModel[key][subkey] === '') {
                                missingValues.push('Missing value in object model: ' + key + '.' + subkey);
                            }
                        }
                    });
                });
                Object.assign(objectModel.AttributeGroupNames, response.ObjectModel.AttributeGroupNames);
                Object.assign(objectModel.AttributeTypeNames, response.ObjectModel.AttributeTypeNames);
                Object.assign(objectModel.ConfigurationItemTypeNames, response.ObjectModel.ConfigurationItemTypeNames);
                Object.assign(objectModel.OtherText, response.ObjectModel.OtherText);
                Object.keys(objectModel.ConnectionTypeNames).forEach(key => {
                    Object.keys(objectModel.ConnectionTypeNames[key]).forEach(subkey => {
                        if (!response.ObjectModel.ConnectionTypeNames[key][subkey] ||
                            response.ObjectModel.ConnectionTypeNames[key][subkey] === '') {
                            missingValues.push('Missing value in object model: ' + key + '.' + subkey);
                        }
                    });
                    Object.assign(objectModel.ConnectionTypeNames[key], response.ObjectModel.ConnectionTypeNames[key]);
                });
                Object.getOwnPropertyNames(statusCodes).forEach(key => {
                    if (!response.StatusCodes[key] || response.StatusCodes[key] === '') {
                        missingValues.push('Missing status code: ' + key);
                    } else {
                        Object.keys(statusCodes[key]).forEach(subkey => {
                            if (subkey !== 'code') {
                                if (!response.StatusCodes[key][subkey] || response.StatusCodes[key][subkey] === '') {
                                    missingValues.push('Missing value in status code: ' + key + '.' + subkey);
                                }
                            }
                        });
                        Object.assign(statusCodes[key], response.StatusCodes[key]);
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
