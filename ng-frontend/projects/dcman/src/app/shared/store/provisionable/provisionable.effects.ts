import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, iif } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom, mergeMap, concatMap, tap, take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Store, Action } from '@ngrx/store';
import { MetaDataSelectors, ReadFunctions, EditFunctions, Guid } from 'backend-access';

import * as fromApp from '../app.reducer';
import * as AssetActions from '../asset/asset.actions';
import * as ProvisionableActions from './provisionable.actions';
import * as fromSelectProvisionables from './provisionable.selectors';
import * as fromSelectBasics from '../basics/basics.selectors';

import { findRule } from '../functions';
import { ExtendedAppConfigService } from '../../app-config.service';
import { FullConfigurationItem } from 'projects/backend-access/src/public-api';

@Injectable()
export class ProvisionableEffects {
    constructor(private actions$: Actions,
                private http: HttpClient,
                private store: Store<fromApp.AppState>) {}

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
        switchMap(action =>
            EditFunctions.deleteConfigurationItem(this.http, action.provisionedSystem.id,
                AssetActions.updateAsset({currentAsset: action.asset, updatedAsset: {
                    id: action.asset.id,
                    model: action.asset.model,
                    name: action.asset.name,
                    serialNumber: action.asset.serialNumber,
                    status: action.status,
                }})
            )
        )
    ));

    // check if user is responsible for provisionable system first, if not, take responsibility
    connectExistingSystemToServerHardware$ = createEffect(() => this.actions$.pipe(
        ofType(ProvisionableActions.connectExistingSystemToServerHardware),
        tap(action => EditFunctions.takeResponsibility(this.http, action.provisionableSystemId, action).pipe(take(1)).subscribe()),
        switchMap(action => ReadFunctions.isUserResponsibleForItem(this.http, action.provisionableSystemId).pipe(
            map(responsible => ({responsible, action})),
        )),
        concatMap(({responsible, action}) => iif(() => responsible, of(action),
            EditFunctions.takeResponsibility(this.http, action.provisionableSystemId).pipe(
                map(() => action),
                catchError(() => of(action))
            )
        )),
        withLatestFrom(this.store.select(fromSelectBasics.selectRuleStores)),
        concatMap(([action, rulesStores]) => {
            const rulesStore = findRule(rulesStores, ExtendedAppConfigService.objectModel.ConnectionTypeNames.Provisions,
                action.provisionableTypeName, action.serverHardware.item.type);
            return EditFunctions.createConnection(this.http, {
                id: Guid.create().toString(),
                description: '',
                upperItemId: action.provisionableSystemId,
                lowerItemId: action.serverHardware.id,
                ruleId: rulesStore.connectionRule.id,
                typeId: rulesStore.connectionRule.connectionTypeId,
            }, AssetActions.updateAsset({currentAsset: action.serverHardware, updatedAsset: {
                id: action.serverHardware.id,
                model: action.serverHardware.model,
                name: action.serverHardware.name,
                serialNumber: action.serverHardware.serialNumber,
                status: action.status,
            }}));
        }),
    ));

    createAndConnectProvisionableSystem$ = createEffect(() => this.actions$.pipe(
        ofType(ProvisionableActions.createAndConnectProvisionableSystem),
        withLatestFrom(this.store.select(fromSelectBasics.selectRuleStores), this.store.select(MetaDataSelectors.selectItemTypes)),
        switchMap(([action, rulesStores, itemTypes]) => {
            const itemType = itemTypes.find(t => t.name.toLocaleLowerCase() === action.typeName.toLocaleLowerCase());
            const rulesStore = findRule(rulesStores, ExtendedAppConfigService.objectModel.ConnectionTypeNames.Provisions,
                action.typeName, action.serverHardware.item.type);
            const item: FullConfigurationItem = {
                id: Guid.create().toString(),
                name: action.name,
                typeId: itemType.id,
                connectionsToLower: [{
                    description: '',
                    id: Guid.create().toString(),
                    ruleId: rulesStore.connectionRule.id,
                    targetId: action.serverHardware.id,
                    typeId: rulesStore.connectionRule.connectionTypeId,
                }],
            };
            return EditFunctions.createFullConfigurationItem(this.http, item,
                ProvisionableActions.readProvisionableSystem({itemId: item.id})).pipe(
                    tap(() => this.store.dispatch(AssetActions.updateAsset({currentAsset: action.serverHardware, updatedAsset: {
                        id: action.serverHardware.id,
                        model: action.serverHardware.model,
                        name: action.serverHardware.name,
                        serialNumber: action.serverHardware.serialNumber,
                        status: action.status,
                    }}))),
                );
        }),
    ));

    readProvisionableSystem$ = createEffect(() => this.actions$.pipe(
        ofType(ProvisionableActions.readProvisionableSystem),
        switchMap(action => ReadFunctions.configurationItem(this.http, action.itemId)),
        switchMap(system => of(ProvisionableActions.addProvisionableSystem({system})))
    ));

}
