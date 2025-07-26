import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { catchError, lastValueFrom, of } from 'rxjs';
import { AppConfig } from './app-config.model';
import * as ErrorActions from '../store/error-handling/error.actions';
import { EnvService } from './env.service';

@Injectable({providedIn: 'root'})
export class AppConfigService {
    static settings: AppConfig = {
        backend: {
            url: '',
            version: 2,
            authMethod: ''
        }
    };
    static authentication: string = null;
    static hasError = false;
    private initializationComplete = false;
    private initProcess: Promise<AppConfig> = null;
    constructor(protected http: HttpClient, private store: Store, private env: EnvService) {
        if (!env.backendBaseUrl) {
            AppConfigService.hasError = true;
            this.store.dispatch(ErrorActions.error({error: new Error('No backend URL configured'), fatal: true}));
            return;
        }
        if (env.backendBaseUrl !== '/rest/' && !AppConfigService.validURL(env.backendBaseUrl)) {
            AppConfigService.hasError = true;
            this.store.dispatch(ErrorActions.error({error: new Error(`Invalid backend URL configured: ${env.backendBaseUrl}`), fatal: true}));
            return;
        }
        AppConfigService.settings.backend.url = env.backendBaseUrl;
    }

    static validURL = (url: string) => {
        const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '(([a-z\\d]([a-z\\d-]*[a-z\\d])*))|' + // hostname
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(url);
    };

    load = async () => {
        if (this.initializationComplete)
        {
            return AppConfigService.settings;
        }
        if (this.initProcess !== null){
            return this.initProcess;
        }
        let url = AppConfigService.settings.backend.url;
        if (url.endsWith('rest/')) {
            url = url.substring(0, url.length - 5);
        }
        url += 'login';
        this.initProcess = lastValueFrom(this.http.get<string>(url).pipe(
            catchError((error: HttpErrorResponse) => {
                const message = error.message ? 'error: ' + error.message : 'error: ' + JSON.stringify(error);
                this.store.dispatch(ErrorActions.error({error, fatal: true}));
                return of(message);
            }),
        )).then(result => {
            if (result.startsWith('error:')) {
                AppConfigService.hasError = true;
                const error = new Error(result);
                this.store.dispatch(ErrorActions.error({error, fatal: true}));
                throw error;
            }
            if (!['jwt', 'ntlm'].includes(result)) {
                AppConfigService.hasError = true;
                const error = new Error(`Illegal auth method: ${result}`);
                this.store.dispatch(ErrorActions.error({error, fatal: true}));
                throw error;
            }
            AppConfigService.settings.backend.authMethod = result;
            this.initializationComplete = true;
            return AppConfigService.settings;
        });
        return this.initProcess;
    };
}
