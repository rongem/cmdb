import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take, skipWhile } from 'rxjs/operators';
import { UserRole, MetaDataSelectors } from 'backend-access';

@Injectable({providedIn: 'root'})
export class AdminAuthGuard implements CanActivate {

    constructor(private store: Store, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.store.select(MetaDataSelectors.selectState).pipe(
            skipWhile(meta => !meta.validData),
            take(1),
            map(meta =>
            meta.userRole === UserRole.administrator ? true : this.router.createUrlTree(['/'])));
    }
}
