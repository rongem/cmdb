import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as DisplayActions from './display.actions';
import * as EditActions from './edit.actions';
import * as MetaDataActions from 'src/app/shared/store/meta-data.actions';

import { getUrl, getHeader, put } from 'src/app/shared/store/functions';
import { Result } from 'src/app/shared/objects/result.model';
import { ConfigurationItem } from 'src/app/shared/objects/configuration-item.model';
import { Store } from '@ngrx/store';

const CONFIGURATIONITEM = 'ConfigurationItem/';

@Injectable()
export class EditEffects {
    constructor(private actions$: Actions,
                private store: Store<fromApp.AppState>,
                private http: HttpClient) {}

    createConfigurationItem$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.createConfigurationItem),
    ));

    updateConfigurationItem$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.updateConfigurationItem),
        switchMap(action => put(this.http, CONFIGURATIONITEM + action.configurationItem.ItemId,
        { item: action.configurationItem },
        DisplayActions.readConfigurationItem({itemId: action.configurationItem.ItemId}))),
    ));

    deleteConfigurationItem$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.deleteConfigurationItem),
    ));
}
