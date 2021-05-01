import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take, skipWhile } from 'rxjs/operators';
import { UserRole, StoreConstants } from 'backend-access';

import * as fromApp from '../../shared/store/app.reducer';

@Injectable({providedIn: 'root'})
export class AdminAuthGuard implements CanActivate {

    constructor(private store: Store<fromApp.AppState>, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.store.select(StoreConstants.METADATA).pipe(
            skipWhile(meta => !meta.validData),
            take(1),
            map(meta =>
            meta.userRole === UserRole.administrator ? true : this.router.createUrlTree(['/'])));
    }
}
