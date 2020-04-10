import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { withLatestFrom } from 'rxjs/operators';
import { Guid, FullConfigurationItem, ConnectionRule, ItemAttribute, Connection, ItemLink, LineMessage,
    MetaDataSelectors, MultiEditActions, LogActions } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import * as fromSelectMultiEdit from 'projects/cmdb/src/app/display/store/multi-edit.selectors';

import { DisplayServiceModule } from '../display-service.module';

@Injectable({providedIn: DisplayServiceModule})
export class MultiEditService {
    private items: FullConfigurationItem[];
    private rules: Map<Guid, ConnectionRule> = new Map();

    constructor(private store: Store<fromApp.AppState>) {
        this.store.select(fromSelectMultiEdit.selectItems).pipe(
            withLatestFrom(this.store.select(MetaDataSelectors.selectConnectionRules)),
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
                        this.store.dispatch(MultiEditActions.deleteItemAttribute({
                            itemAttributeId: att.id,
                            logEntry: {
                                subject: item.type + ': ' + item.name,
                                message: 'delete attribute',
                                details: att.type + ': ' + att.value,
                            }
                        }));
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
                            this.store.dispatch(MultiEditActions.updateItemAttribute({
                                itemAttribute,
                                logEntry: {
                                    subject: item.type + ': ' + item.name,
                                    message: 'change attribute',
                                    details: att.type + ': "' + att.value + '" -> "' + attribute.attributeValue + '"',
                                }
                            }));
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
                        this.store.dispatch(MultiEditActions.createItemAttribute({
                            itemAttribute,
                            logEntry: {
                                subject: item.type + ': ' + item.name,
                                message: 'create attribute',
                                details: attribute.attributeTypeName + ': ' + attribute.attributeValue,
                            }
                        }));
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
                this.store.dispatch(MultiEditActions.deleteConnection({
                    connId: connToDelete.id,
                    logEntry: {
                        subject: item.type + ': ' + item.name,
                        message: 'delete connection',
                        details: connToDelete.connectionType + ' ' + connToDelete.targetType + ': ' + connToDelete.targetName,
                    }
                }));
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
                this.store.dispatch(MultiEditActions.createConnection({
                    connection,
                    logEntry: {
                        subject: item.type + ': ' + item.name,
                        message: 'create connection with',
                        details: conn.targetId + ' (' + conn.description + ')',
                    }
                }));
            });
        });
    }

    deleteLinks(links: {delete: boolean, target: string}[]) {
        links.filter(link => link.delete).forEach(link => {
            this.items.forEach(item => {
                item.links.filter(li => li.uri === link.target).forEach(li => {
                    this.store.dispatch(MultiEditActions.deleteLink({
                        itemLinkId: li.id,
                        logEntry: {
                            subject: item.type + ': ' + item.name,
                            message: 'delete link',
                            details: li.uri,
                        }
                    }));
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
                this.store.dispatch(MultiEditActions.createLink({
                    itemLink,
                    logEntry: {
                        subject: item.type + ': ' + item.name,
                        message: 'add link',
                        details: link.uri,
                    }
                }));
            });
        });
    }

    clearLog() {
        this.store.dispatch(LogActions.clearLog());
    }

    log(logEntry: LineMessage) {
        this.store.dispatch(LogActions.log({logEntry}));
    }
}
