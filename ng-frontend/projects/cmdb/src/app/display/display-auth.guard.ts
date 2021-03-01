import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take, skipWhile } from 'rxjs/operators';
import { UserRole, StoreConstants } from 'backend-access';

import * as fromApp from '../shared/store/app.reducer';

@Injectable({providedIn: 'root'})
export class DisplayAuthGuard implements CanActivate {

    constructor(private store: Store<fromApp.AppState>, private router: Router, private route: ActivatedRoute) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.store.select(StoreConstants.METADATA).pipe(
            skipWhile(meta => !meta.validData),
            take(1),
            map(meta =>
            meta.userRole >= UserRole.Editor ? true : this.router.createUrlTree(['..'])));
    }
}
