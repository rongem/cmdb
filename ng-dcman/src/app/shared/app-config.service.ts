import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AppConfig } from './objects/appsettings/app-config.model';
import { AppObjectModel } from './objects/appsettings/app-object.model';
import { StatusCodes } from './objects/appsettings/status-codes.model';

class AppSettings {
    ObjectModel: AppObjectModel;
    StatusCodes: StatusCodes;
}

@Injectable({providedIn: 'root'})
export class AppConfigService {
    static settings: AppConfig;
    static objectModel: AppObjectModel;
    static statusCodes: StatusCodes;

    constructor(private http: HttpClient) {}

    loadSettings() {
        const jsonFile = `assets/config/config.${environment.name}.json`;
        return new Promise<void>((resolve, reject) => {
            this.http.get<AppConfig>(jsonFile).toPromise().then((response: AppConfig) => {
               AppConfigService.settings = response;
               resolve();
            }).catch((response: any) => {
               reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
            });
        });
    }

    loadAppSettings() {
        const jsonFile = 'assets/config/settings.json';
        return new Promise<void>((resolve, reject) => {
            this.http.get<AppSettings>(jsonFile).toPromise().then((response: AppSettings) => {
                AppConfigService.objectModel = response.ObjectModel;
                AppConfigService.statusCodes = response.StatusCodes;
                resolve();
            }).catch((response: any) => {
                reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
            });
        });
    }

}
