import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs';

import { MultiEditSelectors } from '../../shared/store/store.api';

@Injectable({providedIn: 'root'})
export class MultiEditGuard implements CanActivate {
    constructor(private store: Store, private router: Router) {}
    canActivate() {
        return this.store.select(MultiEditSelectors.selectedItems).pipe(
            take(1),
            map(items => !!items && items.length > 0 ? true : this.router.createUrlTree(['display', 'search'])),
        );
    }
}
