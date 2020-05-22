import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, Observable, forkJoin } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom, mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Store, Action } from '@ngrx/store';
import { MetaDataSelectors, ReadFunctions, EditFunctions, FullConfigurationItem, Guid } from 'backend-access';

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
import { BladeEnclosure } from '../../objects/asset/blade-enclosure.model';
import { AssetValue } from '../../objects/form-values/asset-value.model';
import { RackMountable } from '../../objects/asset/rack-mountable.model';
import { EnclosureMountable } from '../../objects/asset/enclosure-mountable.model';

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
        withLatestFrom(this.store.select(MetaDataSelectors.selectAttributeTypes), this.store.select(fromSelectBasics.selectRuleStores)),
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

    readEnclosure$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.readEnclosure),
        withLatestFrom(this.store.select(fromSelectAsset.selectRacks), this.store.select(fromSelectBasics.selectModels)),
        switchMap(([action, racks, models]) => ReadFunctions.fullConfigurationItem(this.http, action.enclosureId).pipe(
            map(item => AssetActions.setEnclosure({enclosure: new BladeEnclosure(item, racks, models)})),
            catchError(() => of(AssetActions.enclosuresFailed())),
        )),
    ));

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

    readRackMountables$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.readRackMountables),
        mergeMap((action) => getConfigurationItemsByTypeName(this.store, this.http, action.itemType).pipe(
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

    readRackMountable$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.readRackMountable),
        withLatestFrom(this.store.select(fromSelectAsset.selectRacks), this.store.select(fromSelectBasics.selectModels)),
        switchMap(([action, racks, models]) => ReadFunctions.fullConfigurationItem(this.http, action.itemId).pipe(
            map(item => AssetActions.setRackMountable({rackMountable: new RackMountable(item, racks, models)})),
            catchError(() => of(AssetActions.rackMountablesFailed({itemType: action.itemTypeId}))),
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

    readEnclosureMountables$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.readEnclosureMountables),
        mergeMap((action) => getConfigurationItemsByTypeName(this.store, this.http, action.itemType).pipe( // incomplete and wrong
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

    readEnclosureMountable$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.readEnclosureMountable),
        withLatestFrom(this.store.select(fromSelectAsset.selectEnclosures), this.store.select(fromSelectBasics.selectModels)),
        switchMap(([action, enclosures, models]) => ReadFunctions.fullConfigurationItem(this.http, action.itemId).pipe(
            map(item => AssetActions.setEnclosureMountable({enclosureMountable: new EnclosureMountable(item, enclosures, models)})),
            catchError(() => of(AssetActions.enclosureMountablesFailed({itemType: action.itemTypeId}))),
        )),
    ));

    createAsset$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.createAsset),
        withLatestFrom(this.store.select(MetaDataSelectors.selectItemTypes),
                       this.store.select(MetaDataSelectors.selectAttributeTypes),
                       this.store.select(fromSelectBasics.selectRuleStores)),
        mergeMap(([action, itemTypes, attributeTypes, rulesStores]) => {
            const successAction = this.getActionForAssetValue(action.asset);
            const itemType = itemTypes.find(i => i.name.toLocaleLowerCase() === action.asset.model.targetType.toLocaleLowerCase());
            const serialType = attributeTypes.find(a => a.name.toLocaleLowerCase() ===
                ExtendedAppConfigService.objectModel.AttributeTypeNames.SerialNumber.toLocaleLowerCase());
            const statusType = attributeTypes.find(a => a.name.toLocaleLowerCase() ===
                ExtendedAppConfigService.objectModel.AttributeTypeNames.Status.toLocaleLowerCase());
            const rule = findRule(rulesStores, ExtendedAppConfigService.objectModel.ConnectionTypeNames.Is,
                action.asset.model.targetType, ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Model).connectionRule;
            const item: FullConfigurationItem = {
                id: action.asset.id,
                name: action.asset.name,
                typeId: itemType.id,
                attributes: [
                    {
                        id: Guid.create().toString(),
                        typeId: serialType.id,
                        value: action.asset.serialNumber
                    },
                    {
                        id: Guid.create().toString(),
                        typeId: statusType.id,
                        value: Asset.getStatusCodeForAssetStatus(action.asset.status).name
                    },
                ],
                connectionsToLower: [{
                    id: Guid.create().toString(),
                    typeId: rule.connectionTypeId,
                    ruleId: rule.id,
                    targetId: action.asset.model.id,
                    description: '',
                }],
            };
            return EditFunctions.createFullConfigurationItem(this.http, item, successAction);
        }),
    ));

    updateAsset$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.updateAsset),
        withLatestFrom(this.store.select(MetaDataSelectors.selectAttributeTypes), this.store.select(fromSelectBasics.selectRuleStores)),
        switchMap(([action, attributeTypes, ruleStores]) => {
            const results: Observable<Action>[] = [];
            let result = EditFunctions.ensureItem(this.http,
                action.currentAsset.item, action.updatedAsset.name, BasicsActions.noAction());
            if (result) { results.push(result); }
            result = ensureAttribute(this.http, attributeTypes, ExtendedAppConfigService.objectModel.AttributeTypeNames.SerialNumber,
                action.currentAsset.item, action.updatedAsset.serialNumber);
            if (result) { results.push(result); }
            result = ensureAttribute(this.http, attributeTypes, ExtendedAppConfigService.objectModel.AttributeTypeNames.Status,
                action.currentAsset.item, Asset.getStatusCodeForAssetStatus(action.updatedAsset.status).name);
            if (result) { results.push(result); }
            const rulesStore = findRule(ruleStores, ExtendedAppConfigService.objectModel.ConnectionTypeNames.Is,
                action.updatedAsset.model.targetType, ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Model);
            result = ensureUniqueConnectionToLower(this.http, rulesStore.connectionRule, action.currentAsset.item,
                action.updatedAsset.model.id, '');
            if (result) { results.push(result); }
            if (results.length > 0) {
                forkJoin(results).subscribe(actions => actions.forEach(a => this.store.dispatch(a)));
            }
            return of(this.getActionForAssetValue(action.updatedAsset));
        })
    ));

    takeAssetResponsibility$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.takeAssetResponsibility),
        switchMap((action) => EditFunctions.takeResponsibility(this.http, action.asset.id, this.getActionForAssetValue(action.asset)))
    ));

    getActionForAssetValue(asset: AssetValue) {
        switch (asset.model.targetType) {
            case ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Rack.toLocaleLowerCase():
                return AssetActions.readRack({rackId: asset.id});
            case ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BladeEnclosure.toLocaleLowerCase():
                return AssetActions.readEnclosure({enclosureId: asset.id});
            case ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.RackServerHardware.toLocaleLowerCase():
                return AssetActions.readRackServerHardware({itemId: asset.id});
            case ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BladeServerHardware.toLocaleLowerCase():
                return AssetActions.readBladeServerHardware({itemId: asset.id});
            default:
                if (Mappings.enclosureMountables.includes(asset.model.targetType.toLocaleLowerCase())) {
                    return AssetActions.readEnclosureMountable({itemId: asset.id, itemTypeId: asset.model.item.typeId});
                } else {
                    return AssetActions.readRackMountable({itemId: asset.id, itemTypeId: asset.model.item.typeId});
                }
        }

    }
}
