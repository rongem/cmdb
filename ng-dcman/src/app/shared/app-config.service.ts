import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AppConfig } from './objects/appsettings/app-config.model';
import { AppObjectModel } from './objects/appsettings/app-object.model';
import { StatusCodes } from './objects/appsettings/status-codes.model';

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
        Hostname: '',
        IpAddress: '',
        Manufacturer: '',
        MemorySize: '',
        OperatingSystem: '',
        Purpose: '',
        SerialNumber: '',
        Size: '',
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

function validURL(str: string) {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '(([a-z\\d]([a-z\\d-]*[a-z\\d])*))|' + // hostname
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

@Injectable({ providedIn: 'root' })
export class AppConfigService {
    static settings: AppConfig;
    static objectModel: AppObjectModel;
    static statusCodes: StatusCodes;

    constructor(private http: HttpClient) { }

    loadSettings() {
        return Promise.all([this.loadEnvironmentSettings(), this.loadLanguageSettings()]);
    }

    private loadEnvironmentSettings() {
        const jsonFile = `assets/config/config.${environment.name}.json`;
        return new Promise<void>((resolve, reject) => {
            this.http.get<AppConfig>(jsonFile).toPromise().then((response: AppConfig) => {
                AppConfigService.settings = response;
                if (!validURL(AppConfigService.settings.backend.url)) {
                    reject('Not a valid URL: ' + AppConfigService.settings.backend.url);
                }
                resolve();
            }).catch((response: any) => {
                console.log(response);
                reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
            });
        });
    }

    private loadLanguageSettings() {
        const jsonFile = 'assets/config/settings.json';
        return new Promise<void>((resolve, reject) => {
            this.http.get<AppSettings>(jsonFile).toPromise().then((response: AppSettings) => {
                Object.assign(objectModel.AttributeGroupNames, response.ObjectModel.AttributeGroupNames);
                Object.assign(objectModel.AttributeTypeNames, response.ObjectModel.AttributeTypeNames);
                Object.assign(objectModel.ConfigurationItemTypeNames, response.ObjectModel.ConfigurationItemTypeNames);
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
                    reject(missingValues);
                }
                AppConfigService.objectModel = objectModel;
                AppConfigService.statusCodes = statusCodes;
                resolve();
            }).catch((response: any) => {
                reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
            });
        });
    }

}
