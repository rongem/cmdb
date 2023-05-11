import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take, skipWhile } from 'rxjs';
import { UserRole, MetaDataSelectors } from 'backend-access';

@Injectable({providedIn: 'root'})
class AdminAuthGuard  {

    constructor(private store: Store, private router: Router) {}

    canActivate() {
        return this.store.select(MetaDataSelectors.selectState).pipe(
            skipWhile(meta => !meta.validData),
            take(1),
            map(meta =>
            meta.userRole === UserRole.administrator ? true : this.router.createUrlTree(['/'])));
    }
}

export const canActivateAdmin: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(AdminAuthGuard).canActivate();
