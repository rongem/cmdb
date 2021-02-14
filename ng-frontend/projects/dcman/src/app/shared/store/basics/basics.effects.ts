import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store, Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, Observable } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { MetaDataSelectors, ReadFunctions, EditFunctions, FullConfigurationItem, AttributeType } from 'backend-access';

import * as fromApp from '../../store/app.reducer';
import * as AssetActions from '../../store/asset/asset.actions';
import * as BasicsActions from './basics.actions';
import * as fromSelectBasics from './basics.selectors';
import * as ProvisionableActions from '../../store/provisionable/provisionable.actions';

import { getConfigurationItemsByTypeName, llcc } from '../../store/functions';
import { ExtendedAppConfigService } from '../../app-config.service';
import { ConverterService } from '../../store/converter.service';
import { ensureAttribute } from '../store.functions';
import { Model } from '../../objects/model.model';
import { Room } from '../../objects/asset/room.model';

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
            this.store.dispatch(ProvisionableActions.readProvisionableSystems());
            return of(null);
        })
    ), {dispatch: false});

    readRooms$ = createEffect(() => this.actions$.pipe(
        ofType(BasicsActions.readRooms),
        switchMap(() => getConfigurationItemsByTypeName(this.store, this.http,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Room)),
        map(items => BasicsActions.setRooms({rooms: this.convert.convertToRooms(items)})),
        catchError(() => of(BasicsActions.roomsFailed())),
    ));

    readRoom$ = createEffect(() => this.actions$.pipe(
        ofType(BasicsActions.readRoom),
        switchMap(action => ReadFunctions.fullConfigurationItem(this.http, this.store, action.roomId)),
        map(item => BasicsActions.setRoom({room: new Room(item)})),
        catchError(() => of(BasicsActions.roomsFailed())),
    ));

    readModels$ = createEffect(() => this.actions$.pipe(
        ofType(BasicsActions.readModels),
        switchMap(() => getConfigurationItemsByTypeName(this.store, this.http,
            ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Model)),
        map(items => BasicsActions.setModels({models: this.convert.convertToModels(items)})),
        catchError(() => of(BasicsActions.modelsFailed())),
    ));

    readModel$ = createEffect(() => this.actions$.pipe(
        ofType(BasicsActions.readModel),
        switchMap(action => ReadFunctions.fullConfigurationItem(this.http, this.store, action.modelId)),
        map(item => BasicsActions.setModel({model: new Model(item)})),
        catchError(() => of(BasicsActions.modelsFailed())),
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
                id: action.model.id,
                name: action.model.name,
                typeId: itemTypes.find(i => llcc(i.name, ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Model)).id,
                attributes: [
                    {
                        id: undefined,
                        itemId: action.model.id,
                        typeId: this.getAttributeTypeId(attributeTypes,
                            ExtendedAppConfigService.objectModel.AttributeTypeNames.Manufacturer),
                        value: action.model.manufacturer,
                    },
                    {
                        id: undefined,
                        itemId: action.model.id,
                        typeId: this.getAttributeTypeId(attributeTypes,
                            ExtendedAppConfigService.objectModel.AttributeTypeNames.TargetTypeName),
                        value: action.model.targetType,
                    },
                ],
            };
            if (action.model.height && action.model.height > 0) {
                item.attributes.push({
                    id: undefined,
                    itemId: action.model.id,
                    typeId: this.getAttributeTypeId(attributeTypes, ExtendedAppConfigService.objectModel.AttributeTypeNames.Height),
                    value: action.model.height.toString(),
                });
            }
            if (action.model.heightUnits && action.model.heightUnits > 0) {
                item.attributes.push({
                    id: undefined,
                    itemId: action.model.id,
                    typeId: this.getAttributeTypeId(attributeTypes, ExtendedAppConfigService.objectModel.AttributeTypeNames.HeightUnits),
                    value: action.model.heightUnits.toString(),
                });
            }
            if (action.model.width && action.model.width > 0) {
                item.attributes.push({
                    id: undefined,
                    itemId: action.model.id,
                    typeId: this.getAttributeTypeId(attributeTypes, ExtendedAppConfigService.objectModel.AttributeTypeNames.Width),
                    value: action.model.width.toString(),
                });
            }
            return EditFunctions.createFullConfigurationItem(this.http, this.store, item);
        }),
        map(item => BasicsActions.setModel({model: new Model(item)})),
    ));

    updateModel$ = createEffect(() => this.actions$.pipe(
        ofType(BasicsActions.updateModel),
        withLatestFrom(this.store.select(MetaDataSelectors.selectAttributeTypes)),
        switchMap(([action, attributeTypes]) => {
            const results: Observable<Action>[] = [];
            const item = {...action.currentModel.item};
            let changed = false;
            if (item.name !== action.updatedModel.name) {
                item.name = action.updatedModel.name;
                changed = true;
            }
            changed = ensureAttribute(item, attributeTypes, ExtendedAppConfigService.objectModel.AttributeTypeNames.Manufacturer,
                action.updatedModel.manufacturer, changed);
            changed = ensureAttribute(item, attributeTypes, ExtendedAppConfigService.objectModel.AttributeTypeNames.TargetTypeName,
                action.updatedModel.targetType, changed);
            changed = ensureAttribute(item, attributeTypes, ExtendedAppConfigService.objectModel.AttributeTypeNames.Height,
                action.updatedModel.height?.toString(), changed);
            changed = ensureAttribute(item, attributeTypes, ExtendedAppConfigService.objectModel.AttributeTypeNames.Width,
                action.updatedModel.width?.toString(), changed);
            changed = ensureAttribute(item, attributeTypes, ExtendedAppConfigService.objectModel.AttributeTypeNames.HeightUnits,
                action.updatedModel.heightUnits?.toString(), changed);
            changed = ensureAttribute(item, attributeTypes, ExtendedAppConfigService.objectModel.AttributeTypeNames.BackSideSlots,
                action.updatedModel.backSideSlots?.toString(), changed);
            if (changed) {
                return EditFunctions.updateConfigurationItem(this.http, this.store, item).pipe(map(updatedItem => new Model(updatedItem)));
            }
            return of(action.currentModel);
        }),
        map(model => BasicsActions.setModel({model})),
    ));

    deleteModel$ = createEffect(() => this.actions$.pipe(
        ofType(BasicsActions.deleteModel),
        switchMap(action => EditFunctions.deleteConfigurationItem(this.http, this.store, action.modelId)),
        map(() => BasicsActions.noAction()),
    ));

    createRoom$ = createEffect(() => this.actions$.pipe(
        ofType(BasicsActions.createRoom),
        withLatestFrom(this.store.select(MetaDataSelectors.selectAttributeTypes), this.store.select(MetaDataSelectors.selectItemTypes)),
        switchMap(([action, attributeTypes, itemTypes]) => {
            const item: FullConfigurationItem = {
                id: action.room.id,
                name: action.room.name,
                typeId: itemTypes.find(i => llcc(i.name, ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Room)).id,
                attributes: [{
                    id: undefined,
                    itemId: action.room.id,
                    typeId: attributeTypes.find(a => llcc(a.name, ExtendedAppConfigService.objectModel.AttributeTypeNames.BuildingName)).id,
                    value: action.room.building,
                }],
            };
            return EditFunctions.createFullConfigurationItem(this.http, this.store, item);
        }),
        map(item => BasicsActions.setRoom({room: new Room(item)})),
    ));

    updateRoom$ = createEffect(() => this.actions$.pipe(
        ofType(BasicsActions.updateRoom),
        withLatestFrom(this.store.select(MetaDataSelectors.selectAttributeTypes)),
        switchMap(([action, attributeTypes]) => {
            const results: Observable<Action>[] = [];
            const item = {...action.currentRoom.item};
            let changed = false;
            if (item.name !== action.updatedRoom.name) {
                item.name = action.updatedRoom.name;
                changed = true;
            }
            changed = ensureAttribute(item, attributeTypes, ExtendedAppConfigService.objectModel.AttributeTypeNames.BuildingName,
                action.updatedRoom.building, changed);
            if (changed) {
                return EditFunctions.updateConfigurationItem(this.http, this.store, item).pipe(map(updatedItem => new Room(updatedItem)));
            }
            return of(action.currentRoom);
        }),
        map(room => BasicsActions.setRoom({room})),
    ));

    deleteRoom$ = createEffect(() => this.actions$.pipe(
        ofType(BasicsActions.deleteRoom),
        switchMap(action => EditFunctions.deleteConfigurationItem(this.http, this.store, action.roomId)),
        map(() => BasicsActions.noAction()),
    ));

    private getAttributeTypeId(attributeTypes: AttributeType[], name: string) {
        return attributeTypes.find(a => llcc(a.name, name)).id;
    }

}
