import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { concatMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import * as ReadActions from '../read-data/read.actions';
import * as EditActions from './edit.actions';

import { put, post, del } from '../../functions';
import { CONFIGURATIONITEM, ATTRIBUTE, CONNECTION, RESPONSIBILITY, ITEMLINK, FULL } from '../constants';

@Injectable()
export class EditEffects {
    constructor(private actions$: Actions,
                private http: HttpClient) {}

    createConfigurationItem$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.createConfigurationItem),
        concatMap(action => post(this.http, CONFIGURATIONITEM,
            { item: {
                ItemId: action.configurationItem.id,
                ItemType: action.configurationItem.typeId,
                ItemName: action.configurationItem.name,
            }},
            ReadActions.readConfigurationItem({itemId: action.configurationItem.id})))
    ));

    createFullConfigurationItem$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.createFullConfigurationItem),
        concatMap(action => post(this.http, CONFIGURATIONITEM + FULL.substr(1),
            { item: {
                id: action.item.id,
                typeId: action.item.typeId,
                name: action.item.name,
                attributes: action.item.attributes.map(a => ({
                    id: a.id,
                    typeId: a.typeId,
                    value: a.value,
                })),
                connectionsToUpper: action.item.connectionsToUpper.map(c => ({
                    id: c.id,
                    typeId: c.typeId,
                    ruleId: c.ruleId,
                    targetId: c.targetId,
                    description: c.description,
                })),
                connectionsToLower: action.item.connectionsToLower.map(c => ({
                    id: c.id,
                    typeId: c.typeId,
                    ruleId: c.ruleId,
                    targetId: c.targetId,
                    description: c.description,
                })),
                links: action.item.links.map(l => ({
                    id: l.id,
                    uri: l.uri,
                    description: l.description,
                })),
            }},
            ReadActions.readConfigurationItem({itemId: action.item.id})))
    ));

    updateConfigurationItem$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.updateConfigurationItem),
        concatMap(action => put(this.http, CONFIGURATIONITEM + action.configurationItem.id,
            { item: {
                ItemId: action.configurationItem.id,
                ItemType: action.configurationItem.typeId,
                TypeName: action.configurationItem.type,
                ItemName: action.configurationItem.name,
                ItemLastChange: action.configurationItem.lastChange.getTime() * 10000,
                ItemVersion: action.configurationItem.version,
            }},
            ReadActions.readConfigurationItem({itemId: action.configurationItem.id}))),
    ));

    deleteConfigurationItem$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.deleteConfigurationItem),
        concatMap(action => del(this.http, CONFIGURATIONITEM + action.itemId,
            ReadActions.clearConfigurationItem({result: { success: true }})))
    ));

    createItemAttribute$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.createItemAttribute),
        concatMap(action => post(this.http, ATTRIBUTE, { attribute: {
                AttributeId: action.itemAttribute.id,
                ItemId: action.itemAttribute.itemId,
                AttributeTypeId: action.itemAttribute.typeId,
                AttributeValue: action.itemAttribute.value,
            } },
            ReadActions.readConfigurationItem({itemId: action.itemAttribute.itemId})))
    ));

    updateItemAttribute$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.updateItemAttribute),
        concatMap(action => put(this.http, ATTRIBUTE + action.itemAttribute.id,
            { attribute: {
                AttributeId: action.itemAttribute.id,
                ItemId: action.itemAttribute.itemId,
                AttributeTypeId: action.itemAttribute.typeId,
                AttributeTypeName: action.itemAttribute.type,
                AttributeValue: action.itemAttribute.value,
                AttributeLastChange: action.itemAttribute.lastChange.getTime() * 10000,
                AttributeVersion: action.itemAttribute.version,
            } },
            ReadActions.readConfigurationItem({itemId: action.itemAttribute.itemId})))
    ));

    deleteItemAttribute$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.deleteItemAttribute),
        concatMap(action => del(this.http, ATTRIBUTE + action.itemAttribute.id,
            ReadActions.readConfigurationItem({itemId: action.itemAttribute.itemId})))
    ));

    createConnection$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.createConnection),
        concatMap(action => post(this.http, CONNECTION,
            { connection: {
                ConnId: action.connection.id,
                ConnType: action.connection.typeId,
                ConnUpperItem: action.connection.upperItemId,
                ConnLowerItem: action.connection.lowerItemId,
                RuleId: action.connection.ruleId,
                Description: action.connection.description,
            }},
            ReadActions.readConfigurationItem({itemId: action.itemId})))
    ));

    updateConnection$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.updateConnection),
        concatMap(action => put(this.http, CONNECTION + action.connection.id,
            { connection: {
                ConnId: action.connection.id,
                ConnType: action.connection.typeId,
                ConnUpperItem: action.connection.upperItemId,
                ConnLowerItem: action.connection.lowerItemId,
                RuleId: action.connection.ruleId,
                Description: action.connection.description,
            }},
            ReadActions.readConfigurationItem({itemId: action.itemId})))
    ));

    deleteConnection$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.deleteConnection),
        concatMap(action => del(this.http, CONNECTION + action.connId,
            ReadActions.readConfigurationItem({itemId: action.itemId})))
    ));

    takeResponsibility$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.takeResponsibility),
        concatMap(action => post(this.http, CONFIGURATIONITEM + action.itemId + RESPONSIBILITY,
            undefined, ReadActions.readConfigurationItem({itemId: action.itemId})))
    ));

    abandonResponsibility$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.abandonResponsibility),
        concatMap(action => del(this.http, CONFIGURATIONITEM + action.itemId + RESPONSIBILITY,
            ReadActions.readConfigurationItem({itemId: action.itemId})))
    ));

    deleteInvalidResponsibility = createEffect(() => this.actions$.pipe(
        ofType(EditActions.deleteInvalidResponsibility),
        concatMap(action => put(this.http, CONFIGURATIONITEM + action.itemId + RESPONSIBILITY,
            { userToken: action.userToken },
            ReadActions.readConfigurationItem({itemId: action.itemId})))
    ));

    createLink$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.createLink),
        concatMap(action => post(this.http, ITEMLINK, { link: {
                LinkId: action.itemLink.id,
                ItemId: action.itemLink.itemId,
                LinkURI: action.itemLink.uri,
                LinkDescription: action.itemLink.description,
            }},
            ReadActions.readConfigurationItem({itemId: action.itemLink.itemId})))
    ));

    deleteLink$ = createEffect(() => this.actions$.pipe(
        ofType(EditActions.deleteLink),
        concatMap(action => del(this.http, ITEMLINK + action.itemLink.id,
            ReadActions.readConfigurationItem({itemId: action.itemLink.itemId})))
    ));
}
