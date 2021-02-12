import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { withLatestFrom } from 'rxjs/operators';
import { FullConfigurationItem, ConnectionRule, ItemAttribute, Connection, ItemLink, LineMessage,
    MetaDataSelectors, MultiEditActions, LogActions } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import * as fromSelectMultiEdit from 'projects/cmdb/src/app/display/store/multi-edit.selectors';

import { DisplayServiceModule } from '../display-service.module';

@Injectable({providedIn: DisplayServiceModule})
export class MultiEditService {
    private items: FullConfigurationItem[];
    private rules = new Map<string, ConnectionRule>();

    constructor(private store: Store<fromApp.AppState>) {
        this.store.select(fromSelectMultiEdit.selectItems).pipe(
            withLatestFrom(this.store.select(MetaDataSelectors.selectConnectionRules)),
        ).subscribe(([items, rules]) => {
            this.items = items;
            rules.forEach(rule => this.rules.set(rule.id, rule));
        });
    }

    changeAttributes(attributes: {edit: boolean, typeId: string, type: string, value: string}[]) {
        attributes.filter(attribute => attribute.edit).forEach(attribute => {
            this.items.forEach(item => {
                if (item.attributes.findIndex(att => att.typeId === attribute.typeId) > -1) {
                    // existing attribute
                    const att = item.attributes.find(attr => attr.typeId === attribute.typeId);
                    if (!attribute.value || attribute.value === '') {
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
                        if (att.value !== attribute.value) {
                            const itemAttribute: ItemAttribute = {
                                id: att.id,
                                typeId: att.typeId,
                                type: att.type,
                                value: attribute.value,
                                itemId: item.id,
                                version: att.version,
                                lastChange: att.lastChange,
                            };
                            this.store.dispatch(MultiEditActions.updateItemAttribute({
                                itemAttribute,
                                logEntry: {
                                    subject: item.type + ': ' + item.name,
                                    message: 'change attribute',
                                    details: att.type + ': "' + att.value + '" -> "' + attribute.value + '"',
                                }
                            }));
                        }
                    }
                } else {
                    // no attribute found
                    if (!attribute.value || attribute.value === '') {
                        // do nothing
                    } else {
                        // create attribute
                        const itemAttribute: ItemAttribute = {
                            id: undefined,
                            typeId: attribute.typeId,
                            type: attribute.type,
                            value: attribute.value,
                            itemId: item.id,
                            version: 0,
                            lastChange: undefined,
                        };
                        this.store.dispatch(MultiEditActions.createItemAttribute({
                            itemAttribute,
                            logEntry: {
                                subject: item.type + ': ' + item.name,
                                message: 'create attribute',
                                details: attribute.type + ': ' + attribute.value,
                            }
                        }));
                    }
                }
            });
        });
    }

    deleteConnections(connections: {delete: boolean, connectionTypeId: string, targetId: string}[]) {
        connections.filter(connection => connection.delete).forEach(connection => {
            this.items.forEach(item => {
                const connToDelete = item.connectionsToLower.find(conn =>
                    conn.targetId === connection.targetId && conn.typeId === connection.connectionTypeId);
                this.store.dispatch(MultiEditActions.deleteConnection({
                    connectionId: connToDelete.id,
                    logEntry: {
                        subject: item.type + ': ' + item.name,
                        message: 'delete connection',
                        details: connToDelete.type + ' ' + connToDelete.targetType + ': ' + connToDelete.targetName,
                    }
                }));
            });
        });
    }

    addConnections(connections: {add: boolean, ruleId: string, description: string, targetId: string}[]) {
        connections.filter(conn => conn.add).forEach(conn => {
            this.items.forEach(item => {
                const connection: Connection = {
                    id: undefined,
                    upperItemId: item.id,
                    lowerItemId: conn.targetId,
                    typeId: this.rules.get(conn.ruleId).connectionTypeId,
                    description: conn.description,
                    ruleId: conn.ruleId,
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
                    itemId: item.id,
                    id: undefined,
                    uri: link.uri,
                    description: link.description,
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
