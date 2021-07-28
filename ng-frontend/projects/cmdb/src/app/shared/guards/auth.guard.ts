import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { JwtLoginService } from 'backend-access';
import { GlobalActions } from '../store/store.api';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

    constructor(private jwt: JwtLoginService, private router: Router, private store: Store) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.jwt.validLogin.pipe(
            take(1),
            map(valid => {
                if (valid === false) {
                    this.store.dispatch(GlobalActions.setUrl({url: state.url}));
                    return this.router.createUrlTree(['account', 'login']);
                }
                return valid;
            }),
        );
    }
}
