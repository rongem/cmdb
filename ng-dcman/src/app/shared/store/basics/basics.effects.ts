import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as AssetActions from 'src/app/shared/store/asset/asset.actions';
import * as BasicsActions from './basics.actions';
import * as MetaDataActions from 'src/app/shared/store/meta-data.actions';
import * as fromSelectBasics from './basics.selectors';

import { getConfigurationItemsByTypeName } from 'src/app/shared/store/functions';
import { AppConfigService } from 'src/app/shared/app-config.service';
import { ConverterService } from 'src/app/shared/store/converter.service';

@Injectable()
export class BasicsEffects {
    constructor(private actions$: Actions,
                private http: HttpClient,
                private store: Store<fromApp.AppState>,
                private convert: ConverterService) {}

    setMetaDataState$ = createEffect(() => this.actions$.pipe(
        ofType(MetaDataActions.setState),
        switchMap(() => {
            this.store.dispatch(BasicsActions.readRooms());
            this.store.dispatch(BasicsActions.readModels());
            return of(null);
        })
    ), {dispatch: false});

    readRooms$ = createEffect(() => this.actions$.pipe(
        ofType(BasicsActions.readRooms),
        switchMap(() => getConfigurationItemsByTypeName(this.store, this.http,
            AppConfigService.objectModel.ConfigurationItemTypeNames.Room).pipe(
                map(items => BasicsActions.setRooms({rooms: this.convert.convertToRooms(items)})),
                catchError(() => of(BasicsActions.roomsFailed)),
            )),
    ));

    readModels$ = createEffect(() => this.actions$.pipe(
        ofType(BasicsActions.readModels),
        switchMap(() => getConfigurationItemsByTypeName(this.store, this.http,
            AppConfigService.objectModel.ConfigurationItemTypeNames.Model).pipe(
                map(items => BasicsActions.setModels({models: this.convert.convertToModels(items)})),
                catchError(() => of(BasicsActions.modelsFailed)),
            )),
    ));

    basicsFinished$ = createEffect(() => this.actions$.pipe(
        ofType(BasicsActions.setModels, BasicsActions.setRooms),
        withLatestFrom(this.store.select(fromSelectBasics.selectReady)),
        switchMap(([, ready]) => {
            if (ready) {
                this.store.dispatch(AssetActions.readRacks());
            }
            return of(null);
        })
    ), {dispatch: false});
}
