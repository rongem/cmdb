import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, concatMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as MultiEditActions from './multi-edit.actions';
import * as DisplayActions from './display.actions';
import * as EditActions from './edit.actions';

import { put, post, del } from 'src/app/shared/store/functions';

const CONFIGURATIONITEM = 'ConfigurationItem/';
const ATTRIBUTE = 'ItemAttribute/';
const CONNECTION = 'Connection/';
const RESPONSIBILITY = '/Responsibility';
const ITEMLINK = 'ItemLink/';

@Injectable()
export class MultiEditEffects {
    constructor(private actions$: Actions,
                private store: Store<fromApp.AppState>,
                private http: HttpClient) {}

    // for multiple editing, all items must be writable (i.e. user must be responsible for them),
    // so after switching to multi-edit, all responsibilities must be taken
    // also, any existing item that is in store should be removed
    takeMissingResponsibilites$ = createEffect(() => this.actions$.pipe(
        ofType(MultiEditActions.setSelectedItems),
        switchMap(action => {
            action.items.forEach(item => {
                if (item.userIsResponsible === false) {
                    this.store.dispatch(EditActions.takeResponsibility({itemId: item.id}));
                    item.userIsResponsible = true;
                }
            });
            return of(null);
        })
    ), {dispatch: false});
}
