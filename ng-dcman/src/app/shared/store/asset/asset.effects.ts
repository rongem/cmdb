import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as AssetActions from './asset.actions';
import * as fromSelectAsset from './asset.selectors';
import * as fromSelectBasics from 'src/app/shared/store/basics/basics.selectors';

import { getConfigurationItemsByTypeName } from 'src/app/shared/store/functions';
import { AppConfigService } from 'src/app/shared/app-config.service';
import { ConverterService } from 'src/app/shared/store/converter.service';

@Injectable()
export class AssetEffects {
    constructor(private actions$: Actions,
                private http: HttpClient,
                private store: Store<fromApp.AppState>,
                private convert: ConverterService) {}

    readRacks$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.readRacks),
        switchMap(() => getConfigurationItemsByTypeName(this.store, this.http,
            AppConfigService.objectModel.ConfigurationItemTypeNames.Rack).pipe(
                withLatestFrom(this.store.select(fromSelectBasics.selectRooms), this.store.select(fromSelectBasics.selectModels)),
                map(([items, rooms, models]) =>
                    AssetActions.setRacks({racks: this.convert.convertToRacks(items, rooms, models)})),
                catchError(() => of(AssetActions.racksFailed)),
            )),
    ));

    setRacks$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.setRacks),
        switchMap(() => {
            this.store.dispatch(AssetActions.readEnclosures());
            this.store.dispatch(AssetActions.readRackServers());
            return of(null);
        }),
    ), {dispatch: false});

    readEnclosures$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.readEnclosures),
        switchMap(() => getConfigurationItemsByTypeName(this.store, this.http,
            AppConfigService.objectModel.ConfigurationItemTypeNames.BladeEnclosure).pipe(
                withLatestFrom(this.store.select(fromSelectAsset.selectRacks), this.store.select(fromSelectBasics.selectModels)),
                map(([items, racks, models]) =>
                    AssetActions.setEnclosures({enclosures: this.convert.convertToEnclosures(items, racks, models)})),
                catchError(() => of(AssetActions.enclosuresFailed)),
        )),
    ));

    readRackServers$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.readRackServers),
        switchMap(() => getConfigurationItemsByTypeName(this.store, this.http,
            AppConfigService.objectModel.ConfigurationItemTypeNames.RackServerHardware).pipe(
                withLatestFrom(this.store.select(fromSelectAsset.selectRacks), this.store.select(fromSelectBasics.selectModels)),
                map(([items, racks, models]) =>
                    AssetActions.setRackServers({rackservers: this.convert.convertToRackMountable(items, racks, models)})),
                catchError(() => of(AssetActions.rackserversFailed)),
        )),
    ));
}
