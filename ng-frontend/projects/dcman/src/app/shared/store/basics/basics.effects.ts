import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { MetaDataSelectors, EditFunctions, AttributeType, EditActions } from 'backend-access';

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
        withLatestFrom(this.store.select(MetaDataSelectors.selectAttributeTypes)),
        switchMap(([action, attributeTypes]) => {
            const result = EditFunctions.ensureItem(this.http,
                action.currentModel.item, action.updatedModel.name, BasicsActions.noAction());
            let attributeType = this.getAttributeType(attributeTypes, ExtendedAppConfigService.objectModel.AttributeTypeNames.Manufacturer);
            EditFunctions.ensureAttribute(this.store, action.currentModel.item, attributeType, action.updatedModel.manufacturer);
            attributeType = this.getAttributeType(attributeTypes, ExtendedAppConfigService.objectModel.AttributeTypeNames.TargetTypeName);
            EditFunctions.ensureAttribute(this.store, action.currentModel.item, attributeType, action.updatedModel.targetType);
            attributeType = this.getAttributeType(attributeTypes, ExtendedAppConfigService.objectModel.AttributeTypeNames.Height);
            EditFunctions.ensureAttribute(this.store, action.currentModel.item, attributeType, action.updatedModel.height?.toString());
            attributeType = this.getAttributeType(attributeTypes, ExtendedAppConfigService.objectModel.AttributeTypeNames.Width);
            EditFunctions.ensureAttribute(this.store, action.currentModel.item, attributeType, action.updatedModel.width?.toString());
            attributeType = this.getAttributeType(attributeTypes, ExtendedAppConfigService.objectModel.AttributeTypeNames.HeightUnits);
            EditFunctions.ensureAttribute(this.store, action.currentModel.item, attributeType, action.updatedModel.heightUnits?.toString());
            return result ? result : of(BasicsActions.noAction());
        })
    ), {dispatch: false});

    deleteModel$ = createEffect(() => this.actions$.pipe(
        ofType(BasicsActions.deleteModel),
        switchMap(action => of(EditActions.deleteConfigurationItem({itemId: action.modelId})))
    ));

    private getAttributeType(attributeTypes: AttributeType[], name: string) {
        return attributeTypes.find(at => at.name.toLocaleLowerCase() === name.toLocaleLowerCase());
    }
}
