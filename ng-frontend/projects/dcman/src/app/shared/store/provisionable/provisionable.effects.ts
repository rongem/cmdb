import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
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

    connectExistingSystemToServerHardware$ = createEffect(() => this.actions$.pipe(
        ofType(ProvisionableActions.connectExistingSystemToServerHardware),
        tap(action => EditFunctions.takeResponsibility(this.http, action.provisionableSystemId, action).pipe(take(1)).subscribe()),
        withLatestFrom(this.store.select(fromSelectBasics.selectRuleStores)),
        concatMap(([action, rulesStores]) => {
            console.log(action);
            console.log(rulesStores);
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
    ));

}
