import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs';
import { JwtLoginService } from 'backend-access';
import { GlobalActions } from '../store/store.api';

@Injectable({providedIn: 'root'})
class AuthGuard  {

    constructor(private jwt: JwtLoginService, private router: Router, private store: Store) {}

    canActivate(url: string) {
        return this.jwt.validLogin.pipe(
            take(1),
            map(valid => {
                if (valid === false) {
                    this.store.dispatch(GlobalActions.setUrl({url}));
                    return this.router.createUrlTree(['account', 'login']);
                }
                return valid;
            }),
        );
    }
}

export const canActivateAuth: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(AuthGuard).canActivate(state.url);
