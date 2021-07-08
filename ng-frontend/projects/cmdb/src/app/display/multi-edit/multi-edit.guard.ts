import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';

import { DisplayServiceModule } from '../display-service.module';

import * as fromSelectMultiEdit from '../store/multi-edit.selectors';

@Injectable({providedIn: DisplayServiceModule})
export class MultiEditGuard implements CanActivate {
    constructor(private store: Store, private router: Router) {}
    canActivate() {
        return this.store.select(fromSelectMultiEdit.selectItems).pipe(
            take(1),
            map(items => !!items && items.length > 0 ? true : this.router.createUrlTree(['display', 'search'])),
        );
    }
}
