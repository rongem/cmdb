import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, skipWhile, take } from 'rxjs';
import { UserRole, MetaDataSelectors } from 'backend-access';

@Injectable({providedIn: 'root'})
class EditAuthGuard  {

    constructor(private store: Store, private router: Router, private route: ActivatedRoute) {}

    canActivate() {
        return this.store.select(MetaDataSelectors.selectState).pipe(
            skipWhile(meta => !meta.validData),
            take(1),
            map(meta => meta.userRole >= UserRole.editor ? true : this.router.createUrlTree(['..'])),
        );
    }
}

export const canActivateEdit: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(EditAuthGuard).canActivate();
