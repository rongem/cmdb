import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store, Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, Observable, forkJoin } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { MetaDataSelectors, ReadFunctions, EditFunctions, Guid, FullConfigurationItem, AttributeType } from 'backend-access';

import * as fromApp from '../../store/app.reducer';
import * as AssetActions from '../../store/asset/asset.actions';
import * as BasicsActions from './basics.actions';
import * as fromSelectBasics from './basics.selectors';

import { getConfigurationItemsByTypeName } from '../../store/functions';
import { ExtendedAppConfigService } from '../../app-config.service';
import { ConverterService } from '../../store/converter.service';
import { ensureAttribute } from '../store.functions';
import { Model } from '../../objects/model.model';

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

    readModel$ = createEffect(() => this.actions$.pipe(
        ofType(BasicsActions.readModel),
        switchMap(action => ReadFunctions.fullConfigurationItem(this.http, action.modelId).pipe(
            map(item => BasicsActions.setModel({model: new Model(item)})),
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

    createModel$ = createEffect(() => this.actions$.pipe(
        ofType(BasicsActions.createModel),
        withLatestFrom(this.store.select(MetaDataSelectors.selectAttributeTypes), this.store.select(MetaDataSelectors.selectItemTypes)),
        switchMap(([action, attributeTypes, itemTypes]) => {
            const item: FullConfigurationItem = {
                id: Guid.create().toString(),
                name: action.model.name,
                typeId: itemTypes.find(i => i.name.toLocaleLowerCase() ===
                    ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Model).id,
                attributes: [
                    {
                        id: Guid.create().toString(),
                        typeId: this.getAttributeTypeId(attributeTypes,
                            ExtendedAppConfigService.objectModel.AttributeTypeNames.Manufacturer),
                        value: action.model.manufacturer,
                    },
                    {
                        id: Guid.create().toString(),
                        typeId: this.getAttributeTypeId(attributeTypes,
                            ExtendedAppConfigService.objectModel.AttributeTypeNames.TargetTypeName),
                        value: action.model.targetType,
                    },
                ],
            };
            if (action.model.height && action.model.height > 0) {
                item.attributes.push({
                    id: Guid.create().toString(),
                    typeId: this.getAttributeTypeId(attributeTypes, ExtendedAppConfigService.objectModel.AttributeTypeNames.Height),
                    value: action.model.height.toString(),
                });
            }
            if (action.model.heightUnits && action.model.heightUnits > 0) {
                item.attributes.push({
                    id: Guid.create().toString(),
                    typeId: this.getAttributeTypeId(attributeTypes, ExtendedAppConfigService.objectModel.AttributeTypeNames.HeightUnits),
                    value: action.model.heightUnits.toString(),
                });
            }
            if (action.model.width && action.model.width > 0) {
                item.attributes.push({
                    id: Guid.create().toString(),
                    typeId: this.getAttributeTypeId(attributeTypes, ExtendedAppConfigService.objectModel.AttributeTypeNames.Width),
                    value: action.model.width.toString(),
                });
            }
            return EditFunctions.createFullConfigurationItem(this.http, item, BasicsActions.readModel({modelId: item.id}));
        }),
    ));

    updateModel$ = createEffect(() => this.actions$.pipe(
        ofType(BasicsActions.updateModel),
        withLatestFrom(this.store.select(MetaDataSelectors.selectAttributeTypes)),
        switchMap(([action, attributeTypes]) => {
            const results: Observable<Action>[] = [];
            let result = EditFunctions.ensureItem(this.http,
                action.currentModel.item, action.updatedModel.name, BasicsActions.noAction());
            if (result) { results.push(result); }
            result = ensureAttribute(this.http, attributeTypes, ExtendedAppConfigService.objectModel.AttributeTypeNames.Manufacturer,
                action.currentModel.item, action.updatedModel.manufacturer);
            if (result) { results.push(result); }
            result = ensureAttribute(this.http, attributeTypes, ExtendedAppConfigService.objectModel.AttributeTypeNames.TargetTypeName,
                action.currentModel.item, action.updatedModel.targetType);
            if (result) { results.push(result); }
            result = ensureAttribute(this.http, attributeTypes, ExtendedAppConfigService.objectModel.AttributeTypeNames.Height,
                action.currentModel.item, action.updatedModel.height?.toString());
            if (result) { results.push(result); }
            result = ensureAttribute(this.http, attributeTypes, ExtendedAppConfigService.objectModel.AttributeTypeNames.Width,
                action.currentModel.item, action.updatedModel.width?.toString());
            if (result) { results.push(result); }
            result = ensureAttribute(this.http, attributeTypes, ExtendedAppConfigService.objectModel.AttributeTypeNames.HeightUnits,
                action.currentModel.item, action.updatedModel.heightUnits?.toString());
            if (result) { results.push(result); }
            if (results.length > 0) {
                forkJoin(results).subscribe(actions => actions.forEach(a => {
                    if (!(a instanceof BasicsActions.noAction)) {
                        this.store.dispatch(a);
                    }
                }));
            }
            return of(null);
        })
    ), { dispatch: false });

    deleteModel$ = createEffect(() => this.actions$.pipe(
        ofType(BasicsActions.deleteModel),
        switchMap(action => EditFunctions.deleteConfigurationItem(this.http, action.modelId, BasicsActions.noAction())),
    ));

    private getAttributeTypeId(attributeTypes: AttributeType[], name: string) {
        return attributeTypes.find(a => a.name.toLocaleLowerCase() === name.toLocaleLowerCase()).id;
    }
}
