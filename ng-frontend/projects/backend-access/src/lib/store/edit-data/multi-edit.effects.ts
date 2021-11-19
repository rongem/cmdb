import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { switchMap, of } from 'rxjs';

import * as EditActions from './edit.actions';
import * as MultiEditActions from './multi-edit.actions';

import { FullConfigurationItem } from '../../objects/item-data/full/full-configuration-item.model';

@Injectable()
export class MultiEditEffects {
    // for multiple editing, all items must be writable (i.e. user must be responsible for them),
    // so after switching to multi-edit, all responsibilities must be taken
    // also, any existing item that is in store should be removed
    takeMissingResponsibilites$ = createEffect(() => this.actions$.pipe(
        ofType(MultiEditActions.setSelectedItems),
        switchMap(action => {
            let changed = false;
            const items: FullConfigurationItem[] = [];
            action.items.forEach(item => {
                if (item.userIsResponsible === false) {
                    this.store.dispatch(EditActions.takeResponsibility({itemId: item.id}));
                    changed = true;
                    items.push({ ...item, userIsResponsible: true });
                } else {
                    items.push({ ...item });
                }
                if (changed) {
                    this.store.dispatch(MultiEditActions.setSelectedItems({items}));
                }
            });
            return of(null);
        })
    ), {dispatch: false});

    constructor(private actions$: Actions, private store: Store) {}
}
