import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, iif } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom, concatMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { MetaDataSelectors, ReadFunctions, EditFunctions, FullConfigurationItem } from 'backend-access';

import * as fromApp from '../app.reducer';
import * as AssetActions from '../asset/asset.actions';
import * as ProvisionableActions from './provisionable.actions';
import * as fromSelectProvisionables from './provisionable.selectors';
import * as fromSelectBasics from '../basics/basics.selectors';

import { findRule, llcc } from '../functions';
import { ExtendedAppConfigService } from '../../app-config.service';
import { createAssetValue } from '../../objects/form-values/asset-value.model';
import { RackServerHardware } from '../../objects/asset/rack-server-hardware.model';
import { BladeServerHardware } from '../../objects/asset/blade-server-hardware.model';

@Injectable()
export class ProvisionableEffects {
    readProvisionableSystems$ = createEffect(() => this.actions$.pipe(
        ofType(ProvisionableActions.readProvisionableSystems),
        switchMap(() => this.store.select(fromSelectProvisionables.selectProvisionableTypes)),
        switchMap(types => ReadFunctions.configurationItemsByTypes(this.http, types.map(t => t.id)).pipe(
            map(systems => ProvisionableActions.setProvisionableSystems({systems})),
            catchError(() => of(ProvisionableActions.provisionableSystemsFailed())),
        )),
    ));

    // remove provisioned item and change status of asset that provisioned the item
    removeProvisionedSystem$ = createEffect(() => this.actions$.pipe(
        ofType(ProvisionableActions.removeProvisionedSystem),
        tap(action => EditFunctions.deleteConfigurationItem(this.http, this.store, action.provisionedSystem.id).toPromise()),
        map(action => AssetActions.updateAsset({currentAsset: action.asset, updatedAsset: createAssetValue(action.asset, action.status)}))
    ));

    disconnectProvisionedSystem$ = createEffect(() => this.actions$.pipe(
        ofType(ProvisionableActions.disconnectProvisionedSystem),
        tap(action => EditFunctions.deleteConnection(this.http, this.store, action.provisionedSystem.connectionId)),
        map((action) => {
            const updatedItem = FullConfigurationItem.copyItem(action.serverHardware.item);
            updatedItem.connectionsToUpper = updatedItem.connectionsToUpper.filter(c => c.id !== action.provisionedSystem.connectionId);
            return action.serverHardware instanceof RackServerHardware ? AssetActions.setRackMountable({rackMountable: new RackServerHardware(updatedItem)}) :
            AssetActions.setEnclosureMountable({enclosureMountable: new BladeServerHardware(updatedItem)});
        })
    ));

    // check if user is responsible for provisionable system first, if not, take responsibility
    connectExistingSystemToServerHardware$ = createEffect(() => this.actions$.pipe(
        ofType(ProvisionableActions.connectExistingSystemToServerHardware),
        switchMap(action => ReadFunctions.isUserResponsibleForItem(this.store, action.serverHardware.item).pipe(
            map(responsible => ({responsible, action})),
        )),
        concatMap(({responsible, action}) => iif(() => responsible, of(action),
            EditFunctions.takeResponsibility(this.http, this.store, action.provisionableSystemId).pipe(
                map(() => action),
                catchError(() => of(action))
            )
        )),
        withLatestFrom(this.store.select(fromSelectBasics.selectRuleStores)),
        concatMap(([action, rulesStores]) => {
            const rulesStore = findRule(rulesStores, ExtendedAppConfigService.objectModel.ConnectionTypeNames.Provisions,
                action.provisionableTypeName, action.serverHardware.item.type);
            return EditFunctions.createConnection(this.http, this.store, {
                id: undefined,
                description: '',
                upperItemId: action.provisionableSystemId,
                lowerItemId: action.serverHardware.id,
                ruleId: rulesStore.connectionRule.id,
                typeId: rulesStore.connectionRule.connectionTypeId,
            }).pipe(map(() => action));
        }),
        map(action => AssetActions.updateAsset({
            currentAsset: action.serverHardware,
            updatedAsset: createAssetValue(action.serverHardware, action.status)
        })),
    ));

    createAndConnectProvisionableSystem$ = createEffect(() => this.actions$.pipe(
        ofType(ProvisionableActions.createAndConnectProvisionableSystem),
        withLatestFrom(this.store.select(fromSelectBasics.selectRuleStores), this.store.select(MetaDataSelectors.selectItemTypes)),
        switchMap(([action, rulesStores, itemTypes]) => {
            const itemType = itemTypes.find(t => llcc(t.name, action.typeName));
            const rulesStore = findRule(rulesStores, ExtendedAppConfigService.objectModel.ConnectionTypeNames.Provisions,
                action.typeName, action.serverHardware.item.type);
            const item: FullConfigurationItem = {
                name: action.name,
                typeId: itemType.id,
                attributes: [],
                connectionsToLower: [{
                    description: '',
                    ruleId: rulesStore.connectionRule.id,
                    targetId: action.serverHardware.id,
                    typeId: rulesStore.connectionRule.connectionTypeId,
                }],
            };
            return EditFunctions.createFullConfigurationItem(this.http, this.store, item).pipe(map(newItem => ({item: newItem, action})));
        }),
        map(({item, action}) => {
            this.store.dispatch(ProvisionableActions.addProvisionableSystem({system: item}));
            return AssetActions.updateAsset({
                currentAsset: action.serverHardware,
                updatedAsset: createAssetValue(action.serverHardware, action.status)
            });
        }),
    ));

    constructor(private actions$: Actions,
        private http: HttpClient,
        private store: Store<fromApp.AppState>) {}
}
