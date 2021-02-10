import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppConfigService } from '../app-config/app-config.service';
import * as ErrorActions from '../store/error-handling/error.actions';

@Injectable({providedIn: 'root'})
export class JwtLoginService {
    constructor(private http: HttpClient, private store: Store) {
        console.log(AppConfigService.settings.backend);
        if (AppConfigService.settings.backend.authMethod === 'ntlm') {
            this.validLogin.next(true);
        }
    }
    validLogin: BehaviorSubject<boolean> =
        new BehaviorSubject(false);

    login(accountName: string, passphrase: string) {
        let url = AppConfigService.settings.backend.url;
        if (url.endsWith('rest/')) {
            url = url.substr(0, url.length - 5);
        }
        url += 'login';
        this.http.post<{token: string}>(url, { accountName, passphrase }).pipe(take(1))
            .subscribe(result => {
                if (result) {
                    AppConfigService.authentication = 'Bearer ' + result.token;
                    this.validLogin.next(true);
                }
            }, error => {
                this.store.dispatch(ErrorActions.error(error));
                this.validLogin.next(false);
            });
    }
}
