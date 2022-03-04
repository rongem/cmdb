import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, catchError, of, take } from 'rxjs';
import { AppConfigService } from '../app-config/app-config.service';
import * as ErrorActions from '../store/error-handling/error.actions';

@Injectable({providedIn: 'root'})
export class JwtLoginService {
    validLogin = new BehaviorSubject<boolean>(false);
    expiryDate: Date;

    constructor(private http: HttpClient, private store: Store, private appConfig: AppConfigService) {
        this.appConfig.load().then(() => this.setLoginMethod());
    }

    login = (accountName: string, passphrase: string) => {
        let url = AppConfigService.settings.backend.url;
        if (url.endsWith('rest/')) {
            url = url.substr(0, url.length - 5);
        }
        url += 'login';
        this.http.post<{token: string}>(url, { accountName, passphrase }).pipe(
            take(1),
            catchError(error => {
                this.store.dispatch(ErrorActions.error({error, fatal: true}));
                this.validLogin.next(false);
                return of(undefined);
            })
        ).subscribe(result => {
            if (result) {
                const parts = result.token.split('.');
                const obj = JSON.parse(atob(parts[1]));
                this.expiryDate = new Date(0);
                this.expiryDate.setUTCSeconds(obj.exp);
                window.setTimeout(this.logout, this.expiryDate.valueOf() - Date.now());
                AppConfigService.authentication = 'Bearer ' + result.token;
                localStorage.setItem('login', result.token);
                this.validLogin.next(true);
            }
        });
    };

    logout = () => {
        this.validLogin.next(false);
        AppConfigService.authentication = undefined;
        localStorage.removeItem('login');
    };

    private setLoginMethod = () => {
        if (AppConfigService.settings.backend.authMethod === 'ntlm') {
            this.validLogin.next(true);
        } else if (AppConfigService.settings.backend.authMethod === 'jwt') {
            const token = localStorage.getItem('login');
            if (token) {
                const details = this.parseJwt(token) as { exp: number };
                const d = new Date(0);
                d.setUTCSeconds(details.exp);
                if (d.valueOf() > Date.now()) {
                    AppConfigService.authentication = 'Bearer ' + token;
                    this.expiryDate = d;
                    window.setTimeout(this.logout, this.expiryDate.valueOf() - Date.now());
                    this.validLogin.next(true);
                }
            }
        }
    };

    private parseJwt = (token: string) => {
        const base64Url = token.replace('Bearer ', '').split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        return JSON.parse(jsonPayload);
    };
}
