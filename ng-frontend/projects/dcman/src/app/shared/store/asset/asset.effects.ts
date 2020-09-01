import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, Observable, forkJoin, iif } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom, mergeMap, concatMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Store, Action } from '@ngrx/store';
import { MetaDataSelectors, ReadFunctions, EditFunctions, FullConfigurationItem, Guid, ItemType } from 'backend-access';

import * as fromApp from '../app.reducer';
import * as AssetActions from './asset.actions';
import * as fromSelectAsset from './asset.selectors';
import * as fromSelectBasics from '../basics/basics.selectors';
import * as BasicsActions from '../basics/basics.actions';

import { getConfigurationItemsByTypeName, findRule, llcc, llc } from '../functions';
import { ExtendedAppConfigService as AppConfig, ExtendedAppConfigService } from '../../app-config.service';
import { ConverterService } from '../converter.service';
import { ensureAttribute, ensureUniqueConnectionToLower } from '../store.functions';
import { Mappings } from '../../objects/appsettings/mappings.model';
import { Asset } from '../../objects/prototypes/asset.model';
import { Rack } from '../../objects/asset/rack.model';
import { BladeEnclosure } from '../../objects/asset/blade-enclosure.model';
import { AssetValue, createAssetValue } from '../../objects/form-values/asset-value.model';
import { RackMountable } from '../../objects/asset/rack-mountable.model';
import { EnclosureMountable } from '../../objects/asset/enclosure-mountable.model';
import { RackServerHardware } from '../../objects/asset/rack-server-hardware.model';
import { BladeServerHardware } from '../../objects/asset/blade-server-hardware.model';
import { AssetStatus } from '../../objects/asset/asset-status.enum';

@Injectable()
export class AssetEffects {
    constructor(private actions$: Actions,
                private http: HttpClient,
                private store: Store<fromApp.AppState>,
                private convert: ConverterService) {}

    readRacks$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.readRacks),
        switchMap(() => getConfigurationItemsByTypeName(this.store, this.http, AppConfig.objectModel.ConfigurationItemTypeNames.Rack).pipe(
                withLatestFrom(this.store.select(fromSelectBasics.selectRooms), this.store.select(fromSelectBasics.selectModels)),
                map(([items, rooms, models]) => {
                    this.store.dispatch(AssetActions.clearRackMountables());
                    this.store.dispatch(AssetActions.clearEnclosureMountables());
                    return AssetActions.setRacks({racks: this.convert.convertToRacks(items, rooms, models)});
                }),
                catchError((err) => {
                    console.log(err);
                    return of(AssetActions.racksFailed());
                }),
            )),
    ));

    setRacks$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.setRacks),
        switchMap(() => {
            this.store.dispatch(AssetActions.readEnclosures());
            Mappings.rackMountables.forEach(key => {
                if (!llcc(key, AppConfig.objectModel.ConfigurationItemTypeNames.BladeEnclosure)) {
                    this.store.dispatch(AssetActions.readRackMountables({itemType: llc(key)}));
                }
            });
            return of(null);
        }),
    ), {dispatch: false});

    readRack$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.readRack),
        withLatestFrom(this.store.select(fromSelectBasics.selectRooms), this.store.select(fromSelectBasics.selectModels)),
        concatMap(([action, rooms, models]) => ReadFunctions.fullConfigurationItem(this.http, action.rackId).pipe(
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
            let rulesStore = findRule(ruleStores, AppConfig.objectModel.ConnectionTypeNames.BuiltIn,
                AppConfig.objectModel.ConfigurationItemTypeNames.Rack,
                AppConfig.objectModel.ConfigurationItemTypeNames.Room);
            result = ensureUniqueConnectionToLower(this.http, rulesStore.connectionRule, action.currentRack.item,
                action.updatedRack.roomId, '');
            if (result) { results.push(result); }
            rulesStore = findRule(ruleStores, AppConfig.objectModel.ConnectionTypeNames.Is,
                AppConfig.objectModel.ConfigurationItemTypeNames.Rack,
                AppConfig.objectModel.ConfigurationItemTypeNames.Model);
            result = ensureUniqueConnectionToLower(this.http, rulesStore.connectionRule, action.currentRack.item,
                action.updatedRack.modelId, '');
            if (result) { results.push(result); }
            result = ensureAttribute(this.http, attributeTypes, AppConfig.objectModel.AttributeTypeNames.SerialNumber,
                action.currentRack.item, action.updatedRack.serialNumber);
            if (result) { results.push(result); }
            result = ensureAttribute(this.http, attributeTypes, AppConfig.objectModel.AttributeTypeNames.Status,
                action.currentRack.item, Asset.getStatusCodeForAssetStatus(+action.updatedRack.status).name);
            if (result) { results.push(result); }
            if (results.length > 0) {
                forkJoin(results).subscribe(actions => actions.filter(a =>
                    a.type !== BasicsActions.noAction().type).forEach(a => this.store.dispatch(a)));
            }
            return of(AssetActions.readRack({rackId: action.currentRack.id}));
        })
    ));

    readEnclosures$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.readEnclosures),
        switchMap(() => getConfigurationItemsByTypeName(this.store, this.http,
            AppConfig.objectModel.ConfigurationItemTypeNames.BladeEnclosure).pipe(
                withLatestFrom(this.store.select(fromSelectAsset.selectRacks), this.store.select(fromSelectBasics.selectModels)),
                map(([items, racks, models]) =>
                    AssetActions.setEnclosures({enclosures: this.convert.convertToEnclosures(items, racks, models)})),
                catchError(() => of(AssetActions.enclosuresFailed())),
        )),
    ));

    setEnClosures$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.setEnclosures),
        switchMap(() => {
            Mappings.enclosureMountables.forEach(key => {
                this.store.dispatch(AssetActions.readEnclosureMountables({itemType: llc(key)}));
            });
            return of(null);
        }),
    ), {dispatch: false});

    readEnclosure$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.readEnclosure),
        withLatestFrom(this.store.select(fromSelectAsset.selectRacks), this.store.select(fromSelectBasics.selectModels)),
        concatMap(([action, racks, models]) => ReadFunctions.fullConfigurationItem(this.http, action.enclosureId).pipe(
            map(item => AssetActions.setEnclosure({enclosure: new BladeEnclosure(item, racks, models)})),
            catchError(() => of(AssetActions.enclosuresFailed())),
        )),
    ));

    readRackMountables$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.readRackMountables),
        mergeMap((action) => getConfigurationItemsByTypeName(this.store, this.http, action.itemType).pipe(
            withLatestFrom(
                this.store.select(fromSelectAsset.selectRacks),
                this.store.select(fromSelectBasics.selectModels),
                this.store.select(fromSelectBasics.selectRuleStores)
            ),
            map(([items, racks, models, rulesStore]) => AssetActions.addRackMountables({
                itemType: action.itemType,
                rackMountables: llcc(action.itemType, AppConfig.objectModel.ConfigurationItemTypeNames.RackServerHardware) ?
                    this.convert.convertToRackServerHardware(items, racks, models, rulesStore) :
                    this.convert.convertToRackMountable(items, racks, models),
                })
            ),
            catchError(() => of(AssetActions.rackMountablesFailed({itemType: action.itemType}))),
        )),
    ));

    readRackMountable$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.readRackMountable),
        withLatestFrom(
            this.store.select(fromSelectAsset.selectRacks),
            this.store.select(fromSelectBasics.selectModels),
            this.store.select(fromSelectBasics.selectRuleStores),
        ),
        concatMap(([action, racks, models, rulesStore]) => ReadFunctions.fullConfigurationItem(this.http, action.itemId).pipe(
            map(item => AssetActions.setRackMountable({
                rackMountable: llcc(item.type, AppConfig.objectModel.ConfigurationItemTypeNames.RackServerHardware) ?
                    new RackServerHardware(item, racks, models, rulesStore) : new RackMountable(item, racks, models),
            })),
            catchError(() => of(AssetActions.rackMountablesFailed({itemType: action.itemType.id}))),
        )),
    ));

    // check if user is responsible for provisionable system first, if not, take responsibility
    mountRackMountableToRack$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.mountRackMountableToRack),
        switchMap(action => ReadFunctions.isUserResponsibleForItem(this.http, action.rackMountable.id).pipe(
            map(responsible => ({responsible, action})),
        )),
        concatMap(({responsible, action}) => iif(() => responsible, of(action),
            EditFunctions.takeResponsibility(this.http, action.rackMountable.id).pipe(
                map(() => action),
                catchError(() => of(action))
            )
        )),
        withLatestFrom(this.store.select(fromSelectBasics.selectRuleStores)),
        switchMap(([action, rulesStores]) => {
            const rulesStore = findRule(rulesStores, ExtendedAppConfigService.objectModel.ConnectionTypeNames.BuiltIn,
                action.rackMountable.item.type, action.rack.item.type);
            return EditFunctions.createConnection(this.http, {
                id: ExtendedAppConfigService.settings.backend.version === 1 ? Guid.create().toString() : undefined,
                description: action.heightUnits,
                upperItemId: action.rackMountable.id,
                lowerItemId: action.rack.id,
                ruleId: rulesStore.connectionRule.id,
                typeId: rulesStore.connectionRule.connectionTypeId,
            }, AssetActions.updateAsset({
                currentAsset: action.rackMountable,
                updatedAsset: createAssetValue(action.rackMountable, AssetStatus.Unused)
            }));
        }),
    ));

    readEnclosureMountables$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.readEnclosureMountables),
        mergeMap((action) => getConfigurationItemsByTypeName(this.store, this.http, action.itemType).pipe(
            withLatestFrom(
                this.store.select(fromSelectAsset.selectEnclosures),
                this.store.select(fromSelectBasics.selectModels),
                this.store.select(fromSelectBasics.selectRuleStores),
            ),
            map(([items, enclosures, models, rulesStore]) =>
                AssetActions.addEnclosureMountables({
                    itemType: action.itemType,
                    enclosureMountables: llcc(action.itemType, AppConfig.objectModel.ConfigurationItemTypeNames.BladeServerHardware) ?
                        this.convert.convertToBladeServerHardware(items, enclosures, models, rulesStore) :
                        this.convert.convertToEnclosureMountable(items, enclosures, models)
                })
            ),
            catchError(() => of(AssetActions.enclosureMountablesFailed({itemType: action.itemType}))),
        )),
    ));

    readEnclosureMountable$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.readEnclosureMountable),
        withLatestFrom(
            this.store.select(fromSelectAsset.selectEnclosures),
            this.store.select(fromSelectBasics.selectModels),
            this.store.select(fromSelectBasics.selectRuleStores),
        ),
        concatMap(([action, enclosures, models, rulesStore]) => ReadFunctions.fullConfigurationItem(this.http, action.itemId).pipe(
            map(item => AssetActions.setEnclosureMountable({
                enclosureMountable: llcc(item.type, AppConfig.objectModel.ConfigurationItemTypeNames.BladeServerHardware) ?
                    new BladeServerHardware(item, enclosures, models, rulesStore) : new EnclosureMountable(item, enclosures, models),
            })),
            catchError(() => of(AssetActions.enclosureMountablesFailed({itemType: action.itemType.id}))),
        )),
    ));

    mountEnclosureMountableToEnclosure$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.mountEnclosureMountableToEnclosure),
        switchMap(action => ReadFunctions.isUserResponsibleForItem(this.http, action.enclosureMountable.id).pipe(
            map(responsible => ({responsible, action})),
        )),
        concatMap(({responsible, action}) => iif(() => responsible, of(action),
            EditFunctions.takeResponsibility(this.http, action.enclosureMountable.id).pipe(
                map(() => action),
                catchError(() => of(action))
            )
        )),
        withLatestFrom(this.store.select(fromSelectBasics.selectRuleStores)),
        switchMap(([action, rulesStores]) => {
            const rulesStore = findRule(rulesStores, ExtendedAppConfigService.objectModel.ConnectionTypeNames.BuiltIn,
                action.enclosureMountable.item.type, action.enclosure.item.type);
            return EditFunctions.createConnection(this.http, {
                id: ExtendedAppConfigService.settings.backend.version === 1 ? Guid.create().toString() : undefined,
                description: action.slot,
                upperItemId: action.enclosureMountable.id,
                lowerItemId: action.enclosure.id,
                ruleId: rulesStore.connectionRule.id,
                typeId: rulesStore.connectionRule.connectionTypeId,
            }, AssetActions.updateAsset({
                currentAsset: action.enclosureMountable,
                updatedAsset: createAssetValue(action.enclosureMountable, // use enclosure status if backside mountable
                    Mappings.enclosureBackSideMountables.includes(llc(action.enclosureMountable.item.type)) ?
                        action.enclosure.status : AssetStatus.Unused)
            }));
        }),
    ));

    createAsset$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.createAsset),
        withLatestFrom(this.store.select(MetaDataSelectors.selectItemTypes),
                       this.store.select(MetaDataSelectors.selectAttributeTypes),
                       this.store.select(fromSelectBasics.selectRuleStores)),
        mergeMap(([action, itemTypes, attributeTypes, rulesStores]) => {
            const successAction = this.getActionForAssetValue(action.asset, itemTypes);
            const itemType = itemTypes.find(i => llcc(i.name, action.asset.model.targetType));
            const serialType = attributeTypes.find(a => llcc(a.name, AppConfig.objectModel.AttributeTypeNames.SerialNumber));
            const statusType = attributeTypes.find(a => llcc(a.name, AppConfig.objectModel.AttributeTypeNames.Status));
            const rule = findRule(rulesStores, AppConfig.objectModel.ConnectionTypeNames.Is,
                action.asset.model.targetType, AppConfig.objectModel.ConfigurationItemTypeNames.Model).connectionRule;
            const item: FullConfigurationItem = {
                id: action.asset.id,
                name: action.asset.name,
                typeId: itemType.id,
                attributes: [
                    {
                        id: ExtendedAppConfigService.settings.backend.version === 1 ? Guid.create().toString() : undefined,
                        typeId: serialType.id,
                        value: action.asset.serialNumber
                    },
                    {
                        id: ExtendedAppConfigService.settings.backend.version === 1 ? Guid.create().toString() : undefined,
                        typeId: statusType.id,
                        value: Asset.getStatusCodeForAssetStatus(action.asset.status).name
                    },
                ],
                connectionsToLower: [{
                    id: ExtendedAppConfigService.settings.backend.version === 1 ? Guid.create().toString() : undefined,
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
        withLatestFrom(
            this.store.select(MetaDataSelectors.selectItemTypes),
            this.store.select(MetaDataSelectors.selectAttributeTypes),
            this.store.select(fromSelectBasics.selectRuleStores),
        ),
        concatMap(([action, itemTypes, attributeTypes, ruleStores]) => {
            const results: Observable<Action>[] = [];
            let result = EditFunctions.ensureItem(this.http,
                action.currentAsset.item, action.updatedAsset.name, BasicsActions.noAction());
            if (result) { results.push(result); }
            const rulesStore = findRule(ruleStores, AppConfig.objectModel.ConnectionTypeNames.Is,
                action.updatedAsset.model.targetType, AppConfig.objectModel.ConfigurationItemTypeNames.Model);
            result = ensureUniqueConnectionToLower(this.http, rulesStore.connectionRule, action.currentAsset.item,
                action.updatedAsset.model.id, '');
            if (result) { results.push(result); }
            result = ensureAttribute(this.http, attributeTypes, AppConfig.objectModel.AttributeTypeNames.SerialNumber,
                action.currentAsset.item, action.updatedAsset.serialNumber);
            if (result) { results.push(result); }
            result = ensureAttribute(this.http, attributeTypes, AppConfig.objectModel.AttributeTypeNames.Status,
                action.currentAsset.item, Asset.getStatusCodeForAssetStatus(action.updatedAsset.status).name);
            if (result) { results.push(result); }
            if (results.length > 0) {
                forkJoin(results).subscribe(actions =>
                    actions.filter(a => a.type !== BasicsActions.noAction().type).forEach(a => this.store.dispatch(a)));
            }
            return of(this.getActionForAssetValue(action.updatedAsset, itemTypes));
        })
    ));

    unmountRackMountable$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.unmountRackMountable),
        switchMap(action =>
            EditFunctions.deleteConnection(this.http, action.rackMountable.assetConnection.id,
            AssetActions.updateAsset({
                currentAsset: action.rackMountable,
                updatedAsset: createAssetValue(action.rackMountable, action.status),
            })
        )),
    ));

    unmountEnclousreMountable$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.unmountEnclosureMountable),
        switchMap(action =>
            EditFunctions.deleteConnection(this.http, action.enclosureMountable.connectionToEnclosure.id,
            AssetActions.updateAsset({
                currentAsset: action.enclosureMountable,
                updatedAsset: createAssetValue(action.enclosureMountable, action.status),
            })
        )),
    ));

    takeAssetResponsibility$ = createEffect(() => this.actions$.pipe(
        ofType(AssetActions.takeAssetResponsibility),
        withLatestFrom(this.store.select(MetaDataSelectors.selectItemTypes)),
        switchMap(([action, itemTypes]) =>
            EditFunctions.takeResponsibility(this.http, action.asset.id, this.getActionForAssetValue(action.asset, itemTypes))
        ),
    ));

    private getActionForAssetValue = (asset: AssetValue, itemTypes: ItemType[]) => {
        switch (asset.model.targetType) {
            case llc(AppConfig.objectModel.ConfigurationItemTypeNames.Rack):
                return AssetActions.readRack({rackId: asset.id});
            case llc(AppConfig.objectModel.ConfigurationItemTypeNames.BladeEnclosure):
                return AssetActions.readEnclosure({enclosureId: asset.id});
            default:
                const itemType = itemTypes.find(i => i.id === asset.model.item.typeId);
                if (Mappings.enclosureMountables.includes(llc(asset.model.targetType))) {
                    return AssetActions.readEnclosureMountable({itemId: asset.id, itemType });
                } else {
                    return AssetActions.readRackMountable({itemId: asset.id, itemType });
                }
        }

    }

}
