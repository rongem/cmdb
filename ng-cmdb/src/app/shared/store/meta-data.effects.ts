import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import * as MetaDataActions from './meta-data.actions';
import { MetaData } from '../objects/meta-data.model';
import { getUrl, post, put, del } from './functions';
import { AttributeGroup } from '../objects/attribute-group.model';

const METADATA = 'MetaData';
const ATTRIBUTEGROUP = 'AttributeGroup/';
const ATTRIBUTETYPE = 'AttributeType/';
const ITEMTYPE = 'ItemType/';
const CONNECTIONTYPE = 'ConnectionType/';
const CONNECTIONRULE = 'ConnectionRule/';

@Injectable()
export class MetaDataEffects {
    @Effect()
    fetchMetaData = this.actions$.pipe(
        ofType(MetaDataActions.READ_STATE),
        switchMap(() => {
            return this.http.get<MetaData>(getUrl(METADATA)).pipe(
                map((result: MetaData) => new MetaDataActions.SetState(result)),
                catchError((error) => of(new MetaDataActions.Error(error)))
            );
        }),
    );

    @Effect()
    createAttributeGroup = this.actions$.pipe(
        ofType(MetaDataActions.ADD_ATTRIBUTEGROUP),
        switchMap((createdAttributeGroup: MetaDataActions.AddAttributeGroup) => post(this.http, ATTRIBUTEGROUP,
                { attributeGroup: {
                    GroupId: createdAttributeGroup.payload.GroupId.toString(),
                    GroupName: createdAttributeGroup.payload.GroupName } }
            )
        )
    );

    @Effect()
    updateAttributeGroup = this.actions$.pipe(
        ofType(MetaDataActions.UPDATE_ATTRIBUTEGROUP),
        switchMap((updatedAttributeGroup: MetaDataActions.UpdateAttributeGroup) => put(this.http,
            ATTRIBUTEGROUP + updatedAttributeGroup.payload.GroupId,
            { attributeGroup: updatedAttributeGroup.payload })
    ));

    @Effect()
    deleteAttributeGroup = this.actions$.pipe(
        ofType(MetaDataActions.DELETE_ATTRIBUTEGROUP),
        switchMap((deletedAttributeGroup: MetaDataActions.DeleteAttributeGroup) => del(this.http,
            ATTRIBUTEGROUP + deletedAttributeGroup.payload.GroupId))
    );

    @Effect()
    createAttributeType = this.actions$.pipe(
        ofType(MetaDataActions.ADD_ATTRIBUTETYPE),
        switchMap((createdAttributeType: MetaDataActions.AddAttributeType) => post(this.http,
            ATTRIBUTETYPE, { attributeType: {
                    TypeId: createdAttributeType.payload.TypeId.toString(),
                    TypeName: createdAttributeType.payload.TypeName,
                    AttributeGroup: createdAttributeType.payload.AttributeGroup,
                }
            }
        ))
    );

    @Effect()
    updateAttributeType = this.actions$.pipe(
        ofType(MetaDataActions.UPDATE_ATTRIBUTETYPE),
        switchMap((updatedAttributeType: MetaDataActions.UpdateAttributeType) => put(this.http,
            ATTRIBUTETYPE + updatedAttributeType.payload.TypeId,
            { attributeType: updatedAttributeType.payload }
        )
    ));

    @Effect()
    deleteAttributeType = this.actions$.pipe(
        ofType(MetaDataActions.DELETE_ATTRIBUTETYPE),
        switchMap((deletedAttributeType: MetaDataActions.DeleteAttributeType) => del(this.http,
            ATTRIBUTETYPE + deletedAttributeType.payload.TypeId))
    );

    @Effect()
    createItemType = this.actions$.pipe(
        ofType(MetaDataActions.ADD_ITEMTYPE),
        switchMap((createdItemType: MetaDataActions.AddItemType) => post(this.http,
            ITEMTYPE, { itemType: {
                TypeId: createdItemType.payload.TypeId.toString(),
                TypeName: createdItemType.payload.TypeName,
                TypeBackColor: createdItemType.payload.TypeBackColor,
            }})
        )
    );

    @Effect()
    updateItemType = this.actions$.pipe(
        ofType(MetaDataActions.UPDATE_ITEMTYPE),
        switchMap((updatedItemType: MetaDataActions.UpdateItemType) => put(this.http,
            ITEMTYPE + updatedItemType.payload.TypeId,
            { itemType: updatedItemType.payload })
        )
    );

    @Effect()
    deleteItemType = this.actions$.pipe(
        ofType(MetaDataActions.DELETE_ITEMTYPE),
        switchMap((deletedItemType: MetaDataActions.DeleteItemType) => del(this.http,
            ITEMTYPE + deletedItemType.payload.TypeId)
        )
    );

    constructor(private actions$: Actions,
                private http: HttpClient) {}
}

