import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AppConfig } from './app-config.model';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AppConfigService {
    static settings: AppConfig = null;
    static authentication: string = null;
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

    constructor(protected http: HttpClient) {}
    load(environmentName: string = 'dev') {
        const jsonFile = `assets/config/config.${environmentName}.json`;
        return new Promise<void>((resolve, reject) => {
            this.http.get<AppConfig>(jsonFile).toPromise().then(async (response: AppConfig) => {
                if (!response || !response.backend || !response.backend.url)
                {
                    reject('Configuration file contains invalid format. No backend URL could be extracted.');
                }
                if (!AppConfigService.validURL(response.backend.url)) {
                    reject(`Illegal URI: ${response.backend.url}`);
                    return;
                }
                if (!response.backend.version || response.backend.version < 2) {
                    response.backend.version = 2; // at the moment, this has no effect, since version 1 is no longer supported
                }
                let url = response.backend.url;
                if (url.endsWith('rest/')) {
                    url = url.substring(0, url.length - 5);
                }
                url += 'login';
                const result = await this.http.get<string>(url).toPromise()
                    .catch((error: HttpErrorResponse) => error.message ? 'error:' + error.message : 'error:' + JSON.stringify(error));
                if (result.startsWith('error:')) {
                    reject(result);
                    return;
                }
                if (!['jwt', 'ntlm'].includes(result)) {
                    reject(`Illegal auth method: ${result}`);
                    return;
                }
                response.backend.authMethod = result;
                AppConfigService.settings = response;
                resolve();
            }).catch((response: any) => {
                reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
            });
        });
    }
}
