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
                catchError(() => of(AssetActions.racksFailed())),
            )),
    ));

    setRacks$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.setRacks),
        switchMap(() => {
            this.store.dispatch(AssetActions.readEnclosures());
            this.store.dispatch(AssetActions.readRackServers());
            this.store.dispatch(AssetActions.readBackupSystems());
            this.store.dispatch(AssetActions.readNetworkSwitches());
            this.store.dispatch(AssetActions.readSANSwitches());
            this.store.dispatch(AssetActions.readStorageSystems());
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
                catchError(() => of(AssetActions.enclosuresFailed())),
        )),
    ));

    setEnClosures$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.setEnclosures),
        switchMap(() => {
            this.store.dispatch(AssetActions.readBladeServers());
            return of(null);
        }),
    ), {dispatch: false});

    readRackServers$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.readRackServers),
        switchMap(() => getConfigurationItemsByTypeName(this.store, this.http,
            AppConfigService.objectModel.ConfigurationItemTypeNames.RackServerHardware).pipe(
                withLatestFrom(this.store.select(fromSelectAsset.selectRacks), this.store.select(fromSelectBasics.selectModels)),
                map(([items, racks, models]) =>
                    AssetActions.setRackServers({rackServers: this.convert.convertToRackServerHardware(items, racks, models)})),
                catchError(() => of(AssetActions.rackServersFailed())),
        )),
    ));

    readBackupSystems$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.readBackupSystems),
        switchMap(() => getConfigurationItemsByTypeName(this.store, this.http,
            AppConfigService.objectModel.ConfigurationItemTypeNames.BackupSystem).pipe(
                withLatestFrom(this.store.select(fromSelectAsset.selectRacks), this.store.select(fromSelectBasics.selectModels)),
                map(([items, racks, models]) =>
                    AssetActions.setBackupSystems({backupSystems: this.convert.convertToRackMountable(items, racks, models)})),
                catchError(() => of(AssetActions.backupSystemsFailed())),
        )),
    ));

    readNetworkSwitchs$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.readNetworkSwitches),
        switchMap(() => getConfigurationItemsByTypeName(this.store, this.http,
            AppConfigService.objectModel.ConfigurationItemTypeNames.NetworkSwitch).pipe(
                withLatestFrom(this.store.select(fromSelectAsset.selectRacks), this.store.select(fromSelectBasics.selectModels)),
                map(([items, racks, models]) =>
                    AssetActions.setNetworkSwitches({networkSwitches: this.convert.convertToRackMountable(items, racks, models)})),
                catchError(() => of(AssetActions.networkSwitchesFailed())),
        )),
    ));

    readSANSwitchs$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.readSANSwitches),
        switchMap(() => getConfigurationItemsByTypeName(this.store, this.http,
            AppConfigService.objectModel.ConfigurationItemTypeNames.SanSwitch).pipe(
                withLatestFrom(this.store.select(fromSelectAsset.selectRacks), this.store.select(fromSelectBasics.selectModels)),
                map(([items, racks, models]) =>
                    AssetActions.setSANSwitches({sanSwitches: this.convert.convertToRackMountable(items, racks, models)})),
                catchError(() => of(AssetActions.sANSwitchesFailed())),
        )),
    ));

    readStorageSystems$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.readStorageSystems),
        switchMap(() => getConfigurationItemsByTypeName(this.store, this.http,
            AppConfigService.objectModel.ConfigurationItemTypeNames.StorageSystem).pipe(
                withLatestFrom(this.store.select(fromSelectAsset.selectRacks), this.store.select(fromSelectBasics.selectModels)),
                map(([items, racks, models]) =>
                    AssetActions.setStorageSystems({storageSystems: this.convert.convertToRackMountable(items, racks, models)})),
                catchError(() => of(AssetActions.storageSystemsFailed())),
        )),
    ));

    readBladeServers$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.readBladeServers),
        switchMap(() => getConfigurationItemsByTypeName(this.store, this.http,
            AppConfigService.objectModel.ConfigurationItemTypeNames.BladeServerHardware).pipe(
                withLatestFrom(this.store.select(fromSelectAsset.selectEnclosures), this.store.select(fromSelectBasics.selectModels)),
                map(([items, enclosures, models]) =>
                    AssetActions.setBladeServers({bladeServers: this.convert.convertToBladeServerHardware(items, enclosures, models)})),
                catchError(() => of(AssetActions.bladeServersFailed())),
        )),
    ));
}
