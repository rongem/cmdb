import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { switchMap, map, catchError, mergeMap, concatMap } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as MetaDataActions from './meta-data.actions';

import { MetaData } from '../objects/rest-api/meta-data.model';
import { getUrl, post, put } from './functions';
import { AppConfigService } from '../app-config.service';
import { Guid } from '../guid';
import { UserRole } from '../objects/rest-api/user-role.enum';
import { Mappings } from '../objects/appsettings/mappings.model';
import { RuleSettings, RuleTemplate } from '../objects/appsettings/rule-settings.model';
import { ConnectionTypeTemplate } from '../objects/appsettings/app-object.model';
import { ConnectionType } from '../objects/rest-api/connection-type.model';

const METADATA = 'MetaData';

@Injectable()
export class MetaDataEffects {
    constructor(private actions$: Actions,
                private store: Store<fromApp.AppState>,
                private http: HttpClient) {}

    fetchMetaData$ = createEffect(() => this.actions$.pipe(
        ofType(MetaDataActions.readState),
        concatMap(() => {
            return this.http.get<MetaData>(getUrl(METADATA)).pipe(
                map((metaData: MetaData) => MetaDataActions.setState({metaData})),
                catchError((error) => of(MetaDataActions.error({error, invalidateData: true})))
            );
        }),
    ));

    createAttributeGroup$ = createEffect(() => this.actions$.pipe(
        ofType(MetaDataActions.createAttributeGroup),
        mergeMap((action) => post(this.http, 'AttributeGroup', { attributeGroup: action.attributeGroup }))
    ), {dispatch: false});

    createAttributeType$ = createEffect(() => this.actions$.pipe(
        ofType(MetaDataActions.createAttributeType),
        mergeMap((action) => post(this.http, 'AttributeType', { attributeType: action.attributeType }))
    ), {dispatch: false});

    createItemType$ = createEffect(() => this.actions$.pipe(
        ofType(MetaDataActions.createItemType),
        mergeMap((action) => post(this.http, 'ItemType', { itemType: action.itemType }))
    ), {dispatch: false});

    createConnectionType$ = createEffect(() => this.actions$.pipe(
        ofType(MetaDataActions.createConnectionType),
        mergeMap((action) => post(this.http, 'ConnectionType', { connectionType: action.connectionType }))
    ), {dispatch: false});

    createConnectionRule$ = createEffect(() => this.actions$.pipe(
        ofType(MetaDataActions.createConnectionRule),
        mergeMap((action) => post(this.http, 'ConnectionRule', { connectionRule: action.connectionRule }))
    ), {dispatch: false});

    changeConnectionRule$ = createEffect(() => this.actions$.pipe(
        ofType(MetaDataActions.changeConnectionRule),
        mergeMap((action) => put(this.http, 'ConnectionRule', { connectionRule: action.connectionRule }))
    ));

    createItemTypeAttributeGroupMapping$ = createEffect(() => this.actions$.pipe(
        ofType(MetaDataActions.createItemTypeAttributeGroupMapping),
        mergeMap((action) => post(this.http, 'ItemTypeAttributeGroupMapping', { itemTypeAttributeGroupMapping: action.mapping }))
    ), {dispatch: false});

    // check if all necessary meta data exists and create it if not
    // if something goes wrong, just run read as often as necessary
    // break unsuccessful runs if user is not administrator
    setState$ = createEffect(() => this.actions$.pipe(
        ofType(MetaDataActions.setState),
        switchMap(action => {
            let changesOccured = false;
            // create attribute groups if necessary
            Object.keys(AppConfigService.objectModel.AttributeGroupNames).forEach(key => {
                const agn = AppConfigService.objectModel.AttributeGroupNames[key] as string;
                let attributeGroup = action.metaData.attributeGroups.find(ag =>
                    ag.GroupName.toLocaleLowerCase() === agn.toLocaleLowerCase());
                if (!attributeGroup) {
                    attributeGroup = { GroupId: Guid.create(), GroupName: AppConfigService.objectModel.AttributeGroupNames[key]};
                    action.metaData.attributeGroups.push(attributeGroup);
                    this.store.dispatch(MetaDataActions.createAttributeGroup({attributeGroup}));
                    changesOccured = true;
                }
            });
            // create attribute types with appropriate group if necessary
            const mappings = new Mappings();
            Object.keys(AppConfigService.objectModel.AttributeTypeNames).forEach(key => {
                const atn = AppConfigService.objectModel.AttributeTypeNames[key] as string;
                let attributeType = action.metaData.attributeTypes.find(at =>
                    at.TypeName.toLocaleLowerCase() === atn.toLocaleLowerCase());
                if (!attributeType) {
                    attributeType = {
                        TypeId: Guid.create(),
                        TypeName: atn,
                        AttributeGroup: action.metaData.attributeGroups.find(ag =>
                            ag.GroupName.toLocaleLowerCase() ===
                            mappings.attributeGroupsForAttributeType.get(atn.toLocaleLowerCase())).GroupId
                    };
                    action.metaData.attributeTypes.push(attributeType);
                    this.store.dispatch(MetaDataActions.createAttributeType({attributeType}));
                    changesOccured = true;
                }
            });
            // create item types and map them to attribute groups if necessary
            const itemTypeNamesMap = new Map<string, Guid>();
            Object.keys(AppConfigService.objectModel.ConfigurationItemTypeNames).forEach(key => {
                const itn = AppConfigService.objectModel.ConfigurationItemTypeNames[key] as string;
                let itemType = action.metaData.itemTypes.find(it =>
                    it.TypeName.toLocaleLowerCase() === itn.toLocaleLowerCase());
                if (!itemType) {
                    itemType = { TypeId: Guid.create(), TypeName: itn, TypeBackColor: '#000000' };
                    action.metaData.itemTypes.push(itemType);
                    this.store.dispatch(MetaDataActions.createItemType({itemType}));
                    changesOccured = true;
                }
                itemTypeNamesMap.set(itemType.TypeName.toLocaleLowerCase(), itemType.TypeId);
                // check mappings between item type and attribute groups
                mappings.getAttributeGroupsForItemType(itn).forEach(gn => {
                    const group = action.metaData.attributeGroups.find(g => g.GroupName.toLocaleLowerCase() === gn.toLocaleLowerCase());
                    let mapping = action.metaData.itemTypeAttributeGroupMappings.find(
                        m => m.GroupId === group.GroupId && m.ItemTypeId === itemType.TypeId);
                    if (!mapping) {
                        mapping = { GroupId: group.GroupId, ItemTypeId: itemType.TypeId };
                        this.store.dispatch(MetaDataActions.createItemTypeAttributeGroupMapping({mapping}));
                        changesOccured = true;
                    }
                });
            });
            // create connection types if necessary
            Object.keys(AppConfigService.objectModel.ConnectionTypeNames).forEach(key => {
                const ctn = AppConfigService.objectModel.ConnectionTypeNames[key] as ConnectionTypeTemplate;
                let connectionType = action.metaData.connectionTypes.find(ct => this.compare(ctn, ct));
                if (!connectionType) {
                    connectionType = {
                        ConnTypeId: Guid.create(),
                        ConnTypeName: ctn.TopDownName,
                        ConnTypeReverseName: ctn.BottomUpName,
                    };
                    action.metaData.connectionTypes.push(connectionType);
                    this.store.dispatch(MetaDataActions.createConnectionType({connectionType}));
                    changesOccured = true;
                }
                // create or adjust connection rules if necessary
                const ruleSettings = new RuleSettings();
                Object.keys(ruleSettings).forEach(ruleKey => {
                    const ruleTemplate = ruleSettings[ruleKey] as RuleTemplate;
                    if (this.compare(ruleTemplate.connectionType, connectionType)) {
                        ruleTemplate.upperItemNames.forEach(upperName => {
                            const upperId = itemTypeNamesMap.get(upperName.toLocaleLowerCase());
                            ruleTemplate.lowerItemNames.forEach(lowerName => {
                                const lowerId = itemTypeNamesMap.get(lowerName.toLocaleLowerCase());
                                let connectionRule = action.metaData.connectionRules.find(r => r.ConnType === connectionType.ConnTypeId &&
                                    r.ItemUpperType === upperId && r.ItemLowerType === lowerId);
                                if (connectionRule) {
                                    if (connectionRule.MaxConnectionsToLower < ruleTemplate.maxConnectionsTopDown ||
                                        connectionRule.MaxConnectionsToUpper < ruleTemplate.maxConnectionsBottomUp) {
                                        // change connection rule if it is not appropriate
                                        connectionRule.MaxConnectionsToUpper = ruleTemplate.maxConnectionsBottomUp;
                                        connectionRule.MaxConnectionsToLower = ruleTemplate.maxConnectionsTopDown;
                                        this.store.dispatch(MetaDataActions.changeConnectionRule({connectionRule}));
                                        changesOccured = true;
                                    }
                                } else { // create new connection rule
                                    connectionRule = {
                                        RuleId: Guid.create(),
                                        ConnType: connectionType.ConnTypeId,
                                        ItemUpperType: upperId,
                                        ItemLowerType: lowerId,
                                        MaxConnectionsToLower: ruleTemplate.maxConnectionsTopDown,
                                        MaxConnectionsToUpper: ruleTemplate.maxConnectionsBottomUp,
                                    };
                                    this.store.dispatch(MetaDataActions.createConnectionRule({connectionRule}));
                                    changesOccured = true;
                                }
                            });
                        });
                    }
                });
            });
            // check if changes to meta data have been made and react to it
            if (changesOccured) {
                if (action.metaData.userRole !== UserRole.Administrator) {
                    // if user is not administrator, all calls have failed. So give an error
                    return of(MetaDataActions.error({
                        error: new HttpErrorResponse({statusText: 'admin account needed'}),
                        invalidateData: true
                    }));
                } else {
                    // read new meta data after successful changes
                    return of(MetaDataActions.readState());
                }
            }
            return of(MetaDataActions.validateSchema());
        })
    ));

    compare(templ: ConnectionTypeTemplate, type: ConnectionType) {
        return templ.BottomUpName.toLocaleLowerCase() === type.ConnTypeReverseName.toLocaleLowerCase() &&
            templ.TopDownName.toLocaleLowerCase() === type.ConnTypeName.toLocaleLowerCase();
    }

}

