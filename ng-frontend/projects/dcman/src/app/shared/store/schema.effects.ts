import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { switchMap, withLatestFrom } from 'rxjs/operators';
import { MetaDataActions, AdminFunctions, ErrorActions, UserRole, ConnectionType, Guid } from 'backend-access';

import * as fromApp from './app.reducer';
import * as BasicsSelectors from './basics/basics.selectors';
import * as BasicsActions from './basics/basics.actions';

import { ExtendedAppConfigService } from '../app-config.service';
import { Mappings } from '../objects/appsettings/mappings.model';
import { RuleSettings, RuleTemplate } from '../objects/appsettings/rule-settings.model';
import { ConnectionTypeTemplate } from '../objects/appsettings/app-object.model';
import { RuleStore } from '../objects/appsettings/rule-store.model';

@Injectable()
export class SchemaEffects {
    constructor(private actions$: Actions,
                private store: Store<fromApp.AppState>,
                private http: HttpClient) {}

    // check if all necessary meta data exists and create it if not
    // if something goes wrong, just run read as often as necessary
    // break unsuccessful runs if user is not administrator
    setState$ = createEffect(() => this.actions$.pipe(
        ofType(MetaDataActions.setState),
        withLatestFrom(this.store.select(BasicsSelectors.selectRetries)),
        switchMap(([action, retries]) => {
            if (retries > 3) {
                return of(ErrorActions.error({
                    error: 'Retries for creating Schema exceeded, please check with your administrator',
                    fatal: true,
                }));
            }
            let changesOccured = false;
            // create attribute groups if necessary
            Object.keys(ExtendedAppConfigService.objectModel.AttributeGroupNames).forEach(key => {
                const agn = ExtendedAppConfigService.objectModel.AttributeGroupNames[key] as string;
                let attributeGroup = action.metaData.attributeGroups.find(ag =>
                    ag.name.toLocaleLowerCase() === agn.toLocaleLowerCase());
                if (!attributeGroup) {
                    attributeGroup = { id: Guid.create().toString(), name: ExtendedAppConfigService.objectModel.AttributeGroupNames[key]};
                    action.metaData.attributeGroups.push(attributeGroup);
                    AdminFunctions.createAttributeGroup(this.http, attributeGroup, BasicsActions.noAction()).subscribe();
                    changesOccured = true;
                }
            });
            // create attribute types with appropriate group if necessary
            const mappings = new Mappings();
            Object.keys(ExtendedAppConfigService.objectModel.AttributeTypeNames).forEach(key => {
                const atn = ExtendedAppConfigService.objectModel.AttributeTypeNames[key] as string;
                let attributeType = action.metaData.attributeTypes.find(at =>
                    at.name.toLocaleLowerCase() === atn.toLocaleLowerCase());
                if (!attributeType) {
                    attributeType = {
                        id: Guid.create().toString(),
                        name: atn,
                        attributeGroupId: action.metaData.attributeGroups.find(ag =>
                            ag.name.toLocaleLowerCase() ===
                            mappings.attributeGroupsForAttributeType.get(atn.toLocaleLowerCase())).id,
                        validationExpression: Mappings.getValidationExpressionForAttributeType(atn)
                    };
                    action.metaData.attributeTypes.push(attributeType);
                    AdminFunctions.createAttributeType(this.http, attributeType, BasicsActions.noAction()).subscribe();
                    changesOccured = true;
                }
            });
            // create item types and map them to attribute groups if necessary
            const itemTypeNamesMap = new Map<string, string>();
            Object.keys(ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames).forEach(key => {
                const itn = ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames[key] as string;
                let itemType = action.metaData.itemTypes.find(it =>
                    it.name.toLocaleLowerCase() === itn.toLocaleLowerCase());
                if (!itemType) {
                    itemType = { id: Guid.create().toString(), name: itn, backColor: '#FFFFFF' };
                    action.metaData.itemTypes.push(itemType);
                    AdminFunctions.createItemType(this.http, itemType, BasicsActions.noAction()).subscribe();
                    changesOccured = true;
                }
                itemTypeNamesMap.set(itemType.name.toLocaleLowerCase(), itemType.id);
                // check mappings between item type and attribute groups
                mappings.getAttributeGroupsForItemType(itn).forEach(gn => {
                    const group = action.metaData.attributeGroups.find(g => g.name.toLocaleLowerCase() === gn.toLocaleLowerCase());
                    let mapping = action.metaData.itemTypeAttributeGroupMappings.find(
                        m => m.attributeGroupId === group.id && m.itemTypeId === itemType.id);
                    if (!mapping) {
                        mapping = { attributeGroupId: group.id, itemTypeId: itemType.id };
                        AdminFunctions.createItemTypeAttributeGroupMapping(this.http, mapping, BasicsActions.noAction()).subscribe();
                        changesOccured = true;
                    }
                });
            });
            // create connection types if necessary
            const ruleStores: RuleStore[] = [];
            Object.keys(ExtendedAppConfigService.objectModel.ConnectionTypeNames).forEach(key => {
                const ctn = ExtendedAppConfigService.objectModel.ConnectionTypeNames[key] as ConnectionTypeTemplate;
                let connectionType = action.metaData.connectionTypes.find(ct => this.compare(ctn, ct));
                if (!connectionType) {
                    connectionType = {
                        id: Guid.create().toString(),
                        name: ctn.topDownName,
                        reverseName: ctn.bottomUpName,
                    };
                    action.metaData.connectionTypes.push(connectionType);
                    AdminFunctions.createConnectionType(this.http, connectionType, BasicsActions.noAction()).subscribe();
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
                                let connectionRule = action.metaData.connectionRules.find(r => r.connectionTypeId === connectionType.id &&
                                    r.upperItemTypeId === upperId && r.lowerItemTypeId === lowerId);
                                if (connectionRule) {
                                    if (connectionRule.maxConnectionsToLower < ruleTemplate.maxConnectionsTopDown ||
                                        connectionRule.maxConnectionsToUpper < ruleTemplate.maxConnectionsBottomUp ||
                                        connectionRule.validationExpression !== ruleTemplate.validationExpression) {
                                        // change connection rule if it is not appropriate
                                        connectionRule.maxConnectionsToUpper = ruleTemplate.maxConnectionsBottomUp;
                                        connectionRule.maxConnectionsToLower = ruleTemplate.maxConnectionsTopDown;
                                        connectionRule.validationExpression = ruleTemplate.validationExpression;
                                        AdminFunctions.updateConnectionRule(this.http, connectionRule,
                                            BasicsActions.noAction()).subscribe();
                                        changesOccured = true;
                                    }
                                } else { // create new connection rule
                                    connectionRule = {
                                        id: Guid.create().toString(),
                                        connectionTypeId: connectionType.id,
                                        upperItemTypeId: upperId,
                                        lowerItemTypeId: lowerId,
                                        maxConnectionsToLower: ruleTemplate.maxConnectionsTopDown,
                                        maxConnectionsToUpper: ruleTemplate.maxConnectionsBottomUp,
                                        validationExpression: ruleTemplate.validationExpression,
                                    };
                                    AdminFunctions.createConnectionRule(this.http, connectionRule, BasicsActions.noAction()).subscribe();
                                    changesOccured = true;
                                }
                                ruleStores.push({
                                    connectionTypeTemplate: ruleTemplate.connectionType,
                                    upperItemTypeName: upperName,
                                    lowerItemTypeName: lowerName,
                                    connectionRule,
                                });
                            });
                        });
                    }
                });
            });
            this.store.dispatch(BasicsActions.setRuleStore({ruleStores}));
            // check if changes to meta data have been made and react to it
            if (changesOccured) {
                if (action.metaData.userRole !== UserRole.Administrator) {
                    // if user is not administrator, all calls have failed. So give an error
                    return of(ErrorActions.error({
                        error: 'admin account needed',
                        fatal: true
                    }));
                } else {
                    // read new meta data after successful changes
                    this.store.dispatch(BasicsActions.invalidateSchema());
                    return of(MetaDataActions.readState());
                }
            }
            return of(BasicsActions.validateSchema());
        })
    ));

    compare(templ: ConnectionTypeTemplate, type: ConnectionType) {
        return templ.bottomUpName.toLocaleLowerCase() === type.reverseName.toLocaleLowerCase() &&
            templ.topDownName.toLocaleLowerCase() === type.name.toLocaleLowerCase();
    }

}

