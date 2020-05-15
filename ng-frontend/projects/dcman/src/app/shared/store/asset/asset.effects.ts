import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, Observable, forkJoin } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom, mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Store, Action } from '@ngrx/store';
import { MetaDataSelectors, ReadFunctions, EditFunctions } from 'backend-access';

import * as fromApp from '../app.reducer';
import * as AssetActions from './asset.actions';
import * as fromSelectAsset from './asset.selectors';
import * as fromSelectBasics from '../basics/basics.selectors';
import * as BasicsActions from '../basics/basics.actions';

import { getConfigurationItemsByTypeName, findRule } from '../functions';
import { ExtendedAppConfigService } from '../../app-config.service';
import { ConverterService } from '../converter.service';
import { ensureAttribute, ensureUniqueConnectionToLower } from '../store.functions';
import { Mappings } from '../../objects/appsettings/mappings.model';
import { Asset } from '../../objects/prototypes/asset.model';
import { Rack } from '../../objects/asset/rack.model';

@Injectable()
export class AssetEffects {
    constructor(private actions$: Actions,
                private http: HttpClient,
                private store: Store<fromApp.AppState>,
                private convert: ConverterService) {}

    readRacks$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.readRacks),
        switchMap(() => getConfigurationItemsByTypeName(this.store, this.http,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Rack).pipe(
                withLatestFrom(this.store.select(fromSelectBasics.selectRooms), this.store.select(fromSelectBasics.selectModels)),
                map(([items, rooms, models]) => {
                    this.store.dispatch(AssetActions.clearRackMountables());
                    this.store.dispatch(AssetActions.clearEnclosureMountables());
                    return AssetActions.setRacks({racks: this.convert.convertToRacks(items, rooms, models)});
                }),
                catchError(() => of(AssetActions.racksFailed())),
            )),
    ));

    setRacks$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.setRacks),
        switchMap(() => {
            this.store.dispatch(AssetActions.readEnclosures());
            this.store.dispatch(AssetActions.readRackServers());
            Mappings.rackMountables.forEach(key => {
                this.store.dispatch(AssetActions.readRackMountables({itemType: key.toLocaleLowerCase()}));
            });
            return of(null);
        }),
    ), {dispatch: false});

    readRack$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.readRack),
        withLatestFrom(this.store.select(fromSelectBasics.selectRooms), this.store.select(fromSelectBasics.selectModels)),
        switchMap(([action, rooms, models]) => ReadFunctions.fullConfigurationItem(this.http, action.rackId).pipe(
            map(item => AssetActions.setRack({rack: new Rack(item, rooms, models)})),
            catchError(() => of(AssetActions.racksFailed())),
        )),
    ));

    updateRacks$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.updateRack),
        withLatestFrom(this.store.select(MetaDataSelectors.selectAttributeTypes),
            this.store.select(fromSelectBasics.selectRuleStores)),
        switchMap(([action, attributeTypes, ruleStores]) => {
            const results: Observable<Action>[] = [];
            let result = EditFunctions.ensureItem(this.http,
                action.currentRack.item, action.updatedRack.name, BasicsActions.noAction());
            if (result) { results.push(result); }
            result = ensureAttribute(this.http, attributeTypes, ExtendedAppConfigService.objectModel.AttributeTypeNames.SerialNumber,
                action.currentRack.item, action.updatedRack.serialNumber);
            if (result) { results.push(result); }
            result = ensureAttribute(this.http, attributeTypes, ExtendedAppConfigService.objectModel.AttributeTypeNames.Status,
                action.currentRack.item, Asset.getStatusCodeForAssetStatus(+action.updatedRack.status).name);
            if (result) { results.push(result); }
            let rulesStore = findRule(ruleStores, ExtendedAppConfigService.objectModel.ConnectionTypeNames.BuiltIn,
                ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Rack,
                ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Room);
            result = ensureUniqueConnectionToLower(this.http, rulesStore.connectionRule, action.currentRack.item,
                action.updatedRack.roomId, '');
            if (result) { results.push(result); }
            rulesStore = findRule(ruleStores, ExtendedAppConfigService.objectModel.ConnectionTypeNames.Is,
                ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Rack,
                ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Model);
            result = ensureUniqueConnectionToLower(this.http, rulesStore.connectionRule, action.currentRack.item,
                action.updatedRack.modelId, '');
            if (result) { results.push(result); }
            if (results.length > 0) {
                forkJoin(results).subscribe(actions => actions.forEach(a => this.store.dispatch(a)));
            }
            return of(AssetActions.readRack({rackId: action.currentRack.id}));
        })
    ));

    readEnclosures$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.readEnclosures),
        switchMap(() => getConfigurationItemsByTypeName(this.store, this.http,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BladeEnclosure).pipe(
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
            Mappings.enclosureMountables.forEach(key => {
                this.store.dispatch(AssetActions.readEnclosureMountables({itemType: key.toLocaleLowerCase()}));
            });
            return of(null);
        }),
    ), {dispatch: false});

    readRackServers$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.readRackServers),
        switchMap(() => getConfigurationItemsByTypeName(this.store, this.http,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.RackServerHardware).pipe(
                withLatestFrom(this.store.select(fromSelectAsset.selectRacks), this.store.select(fromSelectBasics.selectModels)),
                map(([items, racks, models]) =>
                    AssetActions.setRackServers({rackServers: this.convert.convertToRackServerHardware(items, racks, models)})),
                catchError(() => of(AssetActions.rackServersFailed())),
        )),
    ));

    readRackMountable$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.readRackMountables),
        mergeMap((action) => getConfigurationItemsByTypeName(this.store, this.http,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BackupSystem).pipe(
                withLatestFrom(this.store.select(fromSelectAsset.selectRacks), this.store.select(fromSelectBasics.selectModels)),
                map(([items, racks, models]) =>
                    AssetActions.addRackMountables({
                        itemType: action.itemType,
                        rackMountables: this.convert.convertToRackMountable(items, racks, models)
                    })
                ),
                catchError(() => of(AssetActions.rackMountablesFailed({itemType: action.itemType}))),
        )),
    ));

    readBladeServers$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.readBladeServers),
        switchMap(() => getConfigurationItemsByTypeName(this.store, this.http,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BladeServerHardware).pipe(
                withLatestFrom(this.store.select(fromSelectAsset.selectEnclosures), this.store.select(fromSelectBasics.selectModels)),
                map(([items, enclosures, models]) =>
                    AssetActions.setBladeServers({bladeServers: this.convert.convertToBladeServerHardware(items, enclosures, models)})),
                catchError(() => of(AssetActions.bladeServersFailed())),
        )),
    ));

    readEnclosureMountable$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.readEnclosureMountables),
        mergeMap((action) => getConfigurationItemsByTypeName(this.store, this.http,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BackupSystem).pipe(
                withLatestFrom(this.store.select(fromSelectAsset.selectEnclosures), this.store.select(fromSelectBasics.selectModels)),
                map(([items, enclosures, models]) =>
                    AssetActions.addEnclosureMountables({
                        itemType: action.itemType,
                        enclosureMountables: this.convert.convertToEnclosureMountable(items, enclosures, models)
                    })
                ),
                catchError(() => of(AssetActions.enclosureMountablesFailed({itemType: action.itemType}))),
        )),
    ));
}
