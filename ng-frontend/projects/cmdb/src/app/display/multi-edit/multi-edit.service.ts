import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { withLatestFrom } from 'rxjs/operators';
import { FullConfigurationItem, ConnectionRule, Connection, ItemLink, LineMessage,
    MetaDataSelectors, LogActions, EditFunctions } from 'backend-access';

import * as fromApp from '../../../app/shared/store/app.reducer';
import * as fromSelectMultiEdit from '../store/multi-edit.selectors';

import { DisplayServiceModule } from '../display-service.module';

interface FormValue {
    attributes: {edit: boolean; typeId: string; type: string; value: string}[];
    connectionsToDelete: {delete: boolean; connectionType: string; targetId: string}[];
    connectionsToAdd: {add: boolean; ruleId: string; description: string; targetId: string}[];
    linksToDelete: {delete: boolean; target: string}[];
    linksToAdd: {uri: string; description: string}[];
}

@Injectable({providedIn: DisplayServiceModule})
export class MultiEditService {
    private items: FullConfigurationItem[];
    private changedItemIds: string[];
    private rules = new Map<string, ConnectionRule>();

    constructor(private store: Store<fromApp.AppState>, private http: HttpClient) {
        this.store.select(fromSelectMultiEdit.selectItems).pipe(
            withLatestFrom(this.store.select(MetaDataSelectors.selectConnectionRules)),
        ).subscribe(([items, rules]) => {
            this.items = items.map(FullConfigurationItem.copyItem);
            this.rules = new Map();
            rules.forEach(r => this.rules.set(r.id, r));
        });
    }

    change(formValue: FormValue) {
        this.changedItemIds = [];
        this.clearLog();
        this.changeAttributes(formValue.attributes);
        this.deleteLinks(formValue.linksToDelete);
        this.addLinks(formValue.linksToAdd);
        this.changedItemIds = [...new Set(this.changedItemIds)]; // remove duplicates, then update items
        this.items.filter(item => this.changedItemIds.includes(item.id)).forEach(item => {
            EditFunctions.updateConfigurationItem(this.http, this.store, item).subscribe(i => {
                this.log({
                    subject: i.type + ': ' + i.name,
                    message: 'updated item',
                });
            }, error => {
                this.log({
                    subject: item.type + ': ' + item.name,
                    message: 'failed updating item',
                    details: error.message ?? error.error?.message ?? JSON.stringify(error),
                    severity: 1,
                });
            });
        });
        this.deleteConnections(formValue.connectionsToDelete);
        this.addConnections(formValue.connectionsToAdd);
    }

    private changeAttributes(attributes: {edit: boolean; typeId: string; type: string; value: string}[]) {
        attributes.filter(attribute => attribute.edit).forEach(attribute => {
            this.items.forEach(item => {
                if (item.attributes.findIndex(att => att.typeId === attribute.typeId) > -1) {
                    // existing attribute
                    const att = item.attributes.find(attr => attr.typeId === attribute.typeId);
                    if ((!attribute.value || attribute.value === '') && !!att) {
                        // delete attribute
                        const attPos = item.attributes.findIndex(attr => attr.typeId === att.typeId);
                        item.attributes.splice(attPos, 1);
                        this.changedItemIds.push(item.id);
                        this.log({
                            subject: item.type + ': ' + item.name,
                            message: 'deleting attribute',
                            details: att.type + ': ' + att.value,
                        });
                    } else {
                        // change attribute
                        if (att.value !== attribute.value) {
                            att.value = attribute.value;
                            this.changedItemIds.push(item.id);
                            this.log({
                                subject: item.type + ': ' + item.name,
                                message: 'changing attribute value',
                                details: att.type + ': "' + att.value + '" -> "' + attribute.value + '"',
                            });
                        }
                    }
                } else {
                    // no attribute found
                    if (!attribute.value || attribute.value === '') {
                        // do nothing
                    } else {
                        // create attribute
                        item.attributes.push({
                            typeId: attribute.typeId,
                            value: attribute.value,
                        });
                        this.changedItemIds.push(item.id);
                        this.log({
                            subject: item.type + ': ' + item.name,
                            message: 'creating attribute',
                            details: attribute.type + ': ' + attribute.value,
                        });
                    }
                }
            });
        });
    }

    private deleteLinks(links: {delete: boolean; target: string}[]) {
        links.filter(link => link.delete).forEach(link => {
            this.items.forEach(item => {
                item.links.filter(li => li.uri === link.target).forEach(li => {
                    this.changedItemIds.push(item.id);
                    this.log({
                        subject: item.type + ': ' + item.name,
                        message: 'deleting link',
                        details: li.uri,
                    });
                });
                item.links = item.links.filter(li => li.uri !== link.target);
            });
        });
    }

    private addLinks(links: {uri: string; description: string}[]) {
        links.forEach(link => {
            this.items.forEach(item => {
                if (!item.links.find(l => l.uri === link.uri)) {
                    item.links.push({
                        uri: link.uri,
                        description: link.description,
                    });
                    this.changedItemIds.push(item.id);
                    this.log({
                        subject: item.type + ': ' + item.name,
                        message: 'adding link',
                        details: link.uri,
                    });
                }
            });
        });
    }

    private deleteConnections(connections: {delete: boolean; connectionType: string; targetId: string}[]) {
        connections.filter(connection => connection.delete).forEach(connection => {
            this.items.forEach(item => {
                const connToDelete = item.connectionsToLower.find(conn =>
                    conn.targetId === connection.targetId && conn.typeId === connection.connectionType);
                if (connToDelete) {
                    const connIndex = item.connectionsToLower.findIndex(c => c.id === connToDelete.id);
                    item.connectionsToLower.splice(connIndex, 1);
                    EditFunctions.deleteConnection(this.http, this.store, connToDelete.id).subscribe(() => {
                        this.log({
                            subject: item.type + ': ' + item.name,
                            message: 'deleted connection',
                            details: connToDelete.type + ' ' + connToDelete.targetType + ': ' + connToDelete.targetName,
                        });
                    });
                } else {
                    console.log(item.connectionsToLower, connection);
                }
            });
        });
    }

    private addConnections(connections: {add: boolean; ruleId: string; description: string; targetId: string}[]) {
        // console.log(connections, this.rules);
        connections.filter(conn => conn.add).forEach(conn => {
            this.items.forEach(item => {
                const connection: Connection = {
                    upperItemId: item.id,
                    lowerItemId: conn.targetId,
                    typeId: this.rules.get(conn.ruleId).connectionTypeId,
                    description: conn.description,
                    ruleId: conn.ruleId,
                };
                EditFunctions.createConnection(this.http, this.store, connection).subscribe(() => {
                    this.log({
                        subject: item.type + ': ' + item.name,
                        message: 'created connection with',
                        details: conn.targetId + ' (' + conn.description + ')',
                    });
                });
            });
        });
    }

    private clearLog() {
        this.store.dispatch(LogActions.clearLog());
    }

    private log(logEntry: LineMessage) {
        this.store.dispatch(LogActions.log({logEntry}));
    }
}
