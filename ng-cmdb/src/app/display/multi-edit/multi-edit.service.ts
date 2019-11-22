import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { withLatestFrom } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromSelectMultiEdit from 'src/app/display/store/multi-edit.selectors';
import * as MultiEditActions from 'src/app/display/store/multi-edit.actions';

import { DisplayServiceModule } from '../display-service.module';
import { Guid } from 'src/app/shared/guid';
import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { ConnectionRule } from 'src/app/shared/objects/connection-rule.model';
import { ItemAttribute } from 'src/app/shared/objects/item-attribute.model';
import { Connection } from 'src/app/shared/objects/connection.model';
import { ItemLink } from 'src/app/shared/objects/item-link.model';

@Injectable({providedIn: DisplayServiceModule})
export class MultiEditService {
    private items: FullConfigurationItem[];
    private rules: Map<Guid, ConnectionRule> = new Map();

    constructor(private store: Store<fromApp.AppState>) {
        this.store.select(fromSelectMultiEdit.selectItems).pipe(
            withLatestFrom(this.store.select(fromSelectMetaData.selectConnectionRules)),
        ).subscribe(([items, rules]) => {
            this.items = items;
            rules.forEach(rule => this.rules.set(rule.RuleId, rule));
        });
    }

    changeAttributes(attributes: {edit: boolean, attributeTypeId: Guid, attributeTypeName: string, attributeValue: string}[]) {
        attributes.filter(attribute => attribute.edit).forEach(attribute => {
            this.items.forEach(item => {
                if (item.attributes.findIndex(att => att.typeId === attribute.attributeTypeId) > -1) {
                    // existing attribute
                    const att = item.attributes.find(attr => attr.typeId === attribute.attributeTypeId);
                    if (!attribute.attributeValue || attribute.attributeValue === '') {
                        // delete attribute
                        this.log(item.type + ': ' + item.name + ', delete Attribute ' +
                            att.type + ': ' + att.value);
                        this.store.dispatch(MultiEditActions.deleteItemAttribute({itemAttributeId: att.id}));
                    } else {
                        // change attribute
                        if (att.value !== attribute.attributeValue) {
                            const itemAttribute: ItemAttribute = {
                                AttributeId: att.id,
                                AttributeTypeId: att.typeId,
                                AttributeTypeName: att.type,
                                AttributeValue: attribute.attributeValue,
                                ItemId: item.id,
                                AttributeVersion: att.version,
                                AttributeLastChange: att.lastChange,
                            };
                            this.log(item.type + ': ' + item.name + ', change Attribute ' +
                                att.type + ': ' + att.value + ' to ' + attribute.attributeValue);
                            this.store.dispatch(MultiEditActions.updateItemAttribute({itemAttribute}));
                        }
                    }
                } else {
                    // no attribute found
                    if (!attribute.attributeValue || attribute.attributeValue === '') {
                        // do nothing
                    } else {
                        // create attribute
                        const itemAttribute: ItemAttribute = {
                            AttributeId: Guid.create(),
                            AttributeTypeId: attribute.attributeTypeId,
                            AttributeTypeName: attribute.attributeTypeName,
                            AttributeValue: attribute.attributeValue,
                            ItemId: item.id,
                            AttributeVersion: 0,
                            AttributeLastChange: undefined,
                        };
                        this.log(item.type + ': ' + item.name + ', create Attribute ' +
                            attribute.attributeTypeName + ': ' + attribute.attributeValue);
                        this.store.dispatch(MultiEditActions.createItemAttribute({itemAttribute}));
                    }
                }
            });
        });
    }

    deleteConnections(connections: {delete: boolean, connectionType: Guid, targetId: Guid}[]) {
        connections.filter(connection => connection.delete).forEach(connection => {
            this.items.forEach(item => {
                const connToDelete = item.connectionsToLower.find(conn =>
                    conn.targetId === connection.targetId && conn.typeId === connection.connectionType);
                this.log(item.type + ': ' + item.name + ', delete connection ' + connToDelete.connectionType +
                    ' ' + connToDelete.targetType + ': ' + connToDelete.targetName);
                this.store.dispatch(MultiEditActions.deleteConnection({connId: connToDelete.id}));
            });
        });
    }

    addConnections(connections: {add: boolean, ruleId: Guid, description: string, targetId: Guid}[]) {
        connections.filter(conn => conn.add).forEach(conn => {
            this.items.forEach(item => {
                const connection: Connection = {
                    ConnId: Guid.create(),
                    ConnUpperItem: item.id,
                    ConnLowerItem: conn.targetId,
                    ConnType: this.rules.get(conn.ruleId).ConnType,
                    Description: conn.description,
                    RuleId: conn.ruleId,
                };
                this.log(item.type + ': ' + item.name + ', create connection with ' +
                    conn.targetId + ' (' + conn.description + ')');
                this.store.dispatch(MultiEditActions.createConnection({connection}));
            });
        });
    }

    deleteLinks(links: {delete: boolean, target: string}[]) {
        links.filter(link => link.delete).forEach(link => {
            this.items.forEach(item => {
                item.links.filter(li => li.uri === link.target).forEach(li => {
                    this.log(item.type + ': ' + item.name + ', delete link ' + li.uri);
                    this.store.dispatch(MultiEditActions.deleteLink({itemLinkId: li.id}));
                });
            });
        });
    }

    addLinks(links: {uri: string, description: string}[]) {
        links.forEach(link => {
            this.items.forEach(item => {
                const itemLink: ItemLink = {
                    ItemId: item.id,
                    LinkId: Guid.create(),
                    LinkURI: link.uri,
                    LinkDescription: link.description,
                };
                this.log(item.type + ': ' + item.name + ', add link ' + link.uri);
                this.store.dispatch(MultiEditActions.createLink({itemLink}));
            });
        });
    }

    clearLog() {
        this.store.dispatch(MultiEditActions.clearLog());
    }

    log(logEntry: string) {
        this.store.dispatch(MultiEditActions.log({logEntry}));
    }
}