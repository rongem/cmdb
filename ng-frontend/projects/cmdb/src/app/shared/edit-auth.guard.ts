import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take, skipWhile } from 'rxjs/operators';
import { UserRole, MetaDataSelectors } from 'backend-access';

@Injectable({providedIn: 'root'})
export class EditAuthGuard implements CanActivate {

    constructor(private store: Store, private router: Router, private route: ActivatedRoute) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.store.select(MetaDataSelectors.selectState).pipe(
            skipWhile(meta => !meta.validData),
            take(1),
            map(meta => meta.userRole >= UserRole.editor ? true : this.router.createUrlTree(['..'])),
        );
    }
}
