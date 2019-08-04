import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import * as MetaDataActions from './meta-data.actions';
import { MetaData } from '../objects/meta-data.model';
import { getUrl, post, put, del } from './functions';

const METADATA = 'MetaData';
const ATTRIBUTEGROUP = 'AttributeGroup/';
const ATTRIBUTETYPE = 'AttributeType/';
const ITEMTYPE = 'ItemType/';
const ITEMTYPEATTRIBUTEGROUPMAPPING = 'ItemTypeAttributeGroupMapping/';
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
        switchMap((createdType: MetaDataActions.AddAttributeType) => post(this.http,
            ATTRIBUTETYPE, { attributeType: {
                    TypeId: createdType.payload.TypeId.toString(),
                    TypeName: createdType.payload.TypeName,
                    AttributeGroup: createdType.payload.AttributeGroup,
                }
            }
        ))
    );

    @Effect()
    updateAttributeType = this.actions$.pipe(
        ofType(MetaDataActions.UPDATE_ATTRIBUTETYPE),
        switchMap((updatedType: MetaDataActions.UpdateAttributeType) => put(this.http,
            ATTRIBUTETYPE + updatedType.payload.TypeId,
            { attributeType: updatedType.payload }
        )
    ));

    @Effect()
    deleteAttributeType = this.actions$.pipe(
        ofType(MetaDataActions.DELETE_ATTRIBUTETYPE),
        switchMap((deletedType: MetaDataActions.DeleteAttributeType) => del(this.http,
            ATTRIBUTETYPE + deletedType.payload.TypeId))
    );

    @Effect()
    createItemType = this.actions$.pipe(
        ofType(MetaDataActions.ADD_ITEMTYPE),
        switchMap((createdType: MetaDataActions.AddItemType) => post(this.http,
            ITEMTYPE, { itemType: {
                TypeId: createdType.payload.TypeId.toString(),
                TypeName: createdType.payload.TypeName,
                TypeBackColor: createdType.payload.TypeBackColor,
            }})
        )
    );

    @Effect()
    updateItemType = this.actions$.pipe(
        ofType(MetaDataActions.UPDATE_ITEMTYPE),
        switchMap((updatedType: MetaDataActions.UpdateItemType) => put(this.http,
            ITEMTYPE + updatedType.payload.TypeId,
            { itemType: updatedType.payload })
        )
    );

    @Effect()
    deleteItemType = this.actions$.pipe(
        ofType(MetaDataActions.DELETE_ITEMTYPE),
        switchMap((deletedType: MetaDataActions.DeleteItemType) => del(this.http,
            ITEMTYPE + deletedType.payload.TypeId)
        )
    );

    @Effect()
    createItemTypeAttributeGroupMapping = this.actions$.pipe(
        ofType(MetaDataActions.ADD_ITEMTYPE_ATTRIBUTEGROUP_MAPPING),
        switchMap((createdMapping: MetaDataActions.AddItemTypeAttributeGroupMapping) => post(
            this.http, ITEMTYPEATTRIBUTEGROUPMAPPING,
            { itemTypeAttributeGroupMapping: createdMapping.payload }
        ))
    );

    @Effect()
    deleteItemTypeAttributeGroupMapping = this.actions$.pipe(
        ofType(MetaDataActions.DELETE_ITEMTYPE_ATTRIBUTEGROUP_MAPPING),
        switchMap((deletedMapping: MetaDataActions.DeleteItemTypeAttributeGroupMapping) => del(
            this.http, ITEMTYPEATTRIBUTEGROUPMAPPING + 'group/' +
                deletedMapping.payload.GroupId + '/itemType/' + deletedMapping.payload.ItemTypeId
        ))
    );

    @Effect()
    createConnectionType = this.actions$.pipe(
        ofType(MetaDataActions.ADD_CONNECTIONTYPE),
        switchMap((createdType: MetaDataActions.AddConnectionType) => post(
            this.http, CONNECTIONTYPE, { connectionType: {
                ConnTypeId: createdType.payload.ConnTypeId.toString(),
                ConnTypeName: createdType.payload.ConnTypeName,
                ConnTypeReverseName: createdType.payload.ConnTypeReverseName,
              }}
        ))
    );

    @Effect()
    updateConnectionType = this.actions$.pipe(
        ofType(MetaDataActions.UPDATE_CONNECTIONTYPE),
        switchMap((updatedType: MetaDataActions.UpdateConnectionType) => put(
            this.http, CONNECTIONTYPE + updatedType.payload.ConnTypeId,
            { connectionType: updatedType.payload }
        ))
    );

    @Effect()
    deleteConnectionType = this.actions$.pipe(
        ofType(MetaDataActions.DELETE_CONNECTIONTYPE),
        switchMap((deletedType: MetaDataActions.DeleteConnectionType) => del(
            this.http, CONNECTIONTYPE + deletedType.payload.ConnTypeId
        ))
    );

    @Effect()
    createConnectionRule = this.actions$.pipe(
        ofType(MetaDataActions.ADD_CONNECTIONRULE),
        switchMap((createdRule: MetaDataActions.AddConnectionRule) => post(
            this.http, CONNECTIONRULE, { connectionRule: {
                RuleId: createdRule.payload.RuleId.toString(),
                ItemUpperType: createdRule.payload.ItemUpperType.toString(),
                ItemLowerType: createdRule.payload.ItemLowerType.toString(),
                ConnType: createdRule.payload.ConnType.toString(),
                MaxConnectionsToUpper: createdRule.payload.MaxConnectionsToUpper.toString(),
                MaxConnectionsToLower: createdRule.payload.MaxConnectionsToLower.toString(),
              }}
        ))
    );

    @Effect()
    updateConnectionRule = this.actions$.pipe(
        ofType(MetaDataActions.UPDATE_CONNECTIONRULE),
        switchMap((updatedRule: MetaDataActions.UpdateConnectionRule) => put(
            this.http, CONNECTIONRULE + updatedRule.payload.RuleId,
            { connectionRule: updatedRule.payload }
        ))
    );

    @Effect()
    deleteConnectionRule = this.actions$.pipe(
        ofType(MetaDataActions.DELETE_CONNECTIONRULE),
        switchMap((deletedRule: MetaDataActions.DeleteConnectionRule) => del(
            this.http, CONNECTIONRULE + deletedRule.payload.RuleId
        ))
    );

    constructor(private actions$: Actions,
                private http: HttpClient) {}
}

