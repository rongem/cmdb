import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { MetaDataSelectors, EditFunctions } from 'backend-access';

import * as fromApp from '../../store/app.reducer';
import * as AssetActions from '../../store/asset/asset.actions';
import * as BasicsActions from './basics.actions';
import * as fromSelectBasics from './basics.selectors';

import { getConfigurationItemsByTypeName } from '../../store/functions';
import { ExtendedAppConfigService } from '../../app-config.service';
import { ConverterService } from '../../store/converter.service';

@Injectable()
export class BasicsEffects {
    constructor(private actions$: Actions,
                private http: HttpClient,
                private store: Store<fromApp.AppState>,
                private convert: ConverterService) {}

    validateSchema$ = createEffect(() => this.actions$.pipe(
        ofType(BasicsActions.validateSchema),
        switchMap(() => {
            this.store.dispatch(BasicsActions.readRooms());
            this.store.dispatch(BasicsActions.readModels());
            return of(null);
        })
    ), {dispatch: false});

    readRooms$ = createEffect(() => this.actions$.pipe(
        ofType(BasicsActions.readRooms),
        switchMap(() => getConfigurationItemsByTypeName(this.store, this.http,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Room).pipe(
                map(items => BasicsActions.setRooms({rooms: this.convert.convertToRooms(items)})),
                catchError(() => of(BasicsActions.roomsFailed())),
            )),
    ));

    readModels$ = createEffect(() => this.actions$.pipe(
        ofType(BasicsActions.readModels),
        switchMap(() => getConfigurationItemsByTypeName(this.store, this.http,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Model).pipe(
                map(items => BasicsActions.setModels({models: this.convert.convertToModels(items)})),
                catchError(() => of(BasicsActions.modelsFailed())),
            )),
    ));

    basicsFinished$ = createEffect(() => this.actions$.pipe(
        ofType(BasicsActions.setModels, BasicsActions.setRooms),
        withLatestFrom(this.store.select(fromSelectBasics.selectBasicsReady)),
        switchMap(([, ready]) => {
            if (ready) {
                this.store.dispatch(AssetActions.readRacks());
            }
            return of(null);
        })
    ), {dispatch: false});

    updateModel$ = createEffect(() => this.actions$.pipe(
        ofType(BasicsActions.updateModel),
        switchMap(action => {
            const result = EditFunctions.ensureItem(this.http,
                action.currentModel.item, action.updatedModel.name, BasicsActions.noAction());
            // attributes required
            return result ? result : of(BasicsActions.noAction());
        })
    ), {dispatch: false});
}
