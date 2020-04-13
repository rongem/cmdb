import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from './app-config.model';

@Injectable({providedIn: 'root'})
export class AppConfigService {
    static settings: AppConfig = null;
    static validURL(url: string) {
        const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
          '(([a-z\\d]([a-z\\d-]*[a-z\\d])*))|' + // hostname
          '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
          '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(url);
      }

    constructor(private http: HttpClient) {}
    load(environmentName: string = 'dev') {
        const jsonFile = `assets/config/config.${environmentName}.json`;
        return new Promise<void>((resolve, reject) => {
            this.http.get<AppConfig>(jsonFile).toPromise().then((response: AppConfig) => {
                if (!response || !response.backend || !response.backend.url)
                {
                    reject('Configuration file contains invalid format. No backend URL could be extracted.');
                }
                if (!AppConfigService.validURL(response.backend.url)) {
                    reject('Illegal URI: ' + response.backend.url);
                }
                AppConfigService.settings = response;
                resolve();
            }).catch((response: any) => {
                reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
            });
        });
    }
}
