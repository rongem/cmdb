import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom, mergeMap, concatMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Store, Action } from '@ngrx/store';
import { MetaDataSelectors, ReadFunctions, EditFunctions } from 'backend-access';

import * as fromApp from '../app.reducer';
import * as AssetActions from '../asset/asset.actions';
import * as ProvisionableActions from './provisionable.actions';
import * as fromSelectProvisionables from './provisionable.selectors';

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

}
