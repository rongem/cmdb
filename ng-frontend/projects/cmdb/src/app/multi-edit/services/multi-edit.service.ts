import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Subject, switchMap, withLatestFrom } from 'rxjs';
import { FullConfigurationItem, ConnectionRule, Connection, LineMessage,
    MetaDataSelectors, LogActions, EditFunctions, ReadFunctions } from 'backend-access';
import { MultiEditActions, MultiEditSelectors } from '../../shared/store/store.api';
import { MultiEditServiceModule } from '../multi-edit-service.module';
import { TargetConnections } from '../../shared/objects/target-connections.model';

interface FormValue {
    attributes: {edit: boolean; typeId: string; type: string; value: string}[];
    connectionsToDelete: {delete: boolean; connectionType: string; targetId: string}[];
    connectionsToAdd: {add: boolean; ruleId: string; description: string; targetId: string}[];
    linksToDelete: {delete: boolean; target: string}[];
    linksToAdd: {uri: string; description: string}[];
}

@Injectable({providedIn: MultiEditServiceModule})
export class MultiEditService {
    itemsToChange = 0;
    itemsChanged = 0;
    connectionsToChange = 0;
    connectionsChanged = 0;
    operationsLeftSubject = new Subject<number>();
    private items: FullConfigurationItem[];
    private changedItemIds: string[];
    private rules = new Map<string, ConnectionRule>();
    constructor(private store: Store, private http: HttpClient) {
        this.store.select(MultiEditSelectors.selectedItems).pipe(
            withLatestFrom(this.store.select(MetaDataSelectors.selectConnectionRules)),
        ).subscribe(([items, rules]) => {
            this.items = items.map(FullConfigurationItem.copyItem);
            this.rules = new Map();
            rules.forEach(r => this.rules.set(r.id, r));
        });
    }

    operationsLeft() {
        return this.itemsToChange + this.connectionsToChange - this.itemsChanged - this.connectionsChanged;
    }

    change(formValue: FormValue) {
        this.itemsToChange = 0;
        this.itemsChanged = 0;
        this.connectionsChanged = 0;
        this.connectionsToChange = 0;
        this.changedItemIds = [];
        this.clearLog();
        this.addLinks(formValue.linksToAdd);
        this.changedItemIds = [...new Set(this.changedItemIds)]; // remove duplicates, then update items
        const items = this.items.filter(item => this.changedItemIds.includes(item.id));
        this.itemsToChange = items.length;
        items.forEach(item => {
            EditFunctions.updateConfigurationItem(this.http, this.store, item).subscribe({
                next: i => {
                    this.itemsChanged++;
                    this.operationsLeftSubject.next(this.operationsLeft());
                    this.log({
                        subject: i.type + ': ' + i.name,
                        subjectId: i.id,
                        message: 'updated item',
                    });
                },
                error: error => {
                    this.itemsToChange--;
                    this.operationsLeftSubject.next(this.operationsLeft());
                    this.log({
                        subject: item.type + ': ' + item.name,
                        subjectId: item.id,
                        message: 'failed updating item',
                        details: error.message ?? error.error?.message ?? JSON.stringify(error),
                        severity: 1,
                    });
                },
            });
        });
        this.connectionsToChange = formValue.connectionsToAdd.filter(conn => conn.add).length +
            formValue.connectionsToDelete.filter(connection => connection.delete).length;
        this.operationsLeftSubject.next(this.operationsLeft());
    }

    setAttributeValues(items: FullConfigurationItem[], attributeTypeId: string, attributeValue: string) {
        // first remove items that don't need a change, then replace attribute or set it
        items = items.filter(item => !item.attributes.map(a => a.typeId).includes(attributeTypeId) ||
            item.attributes.find(a => a.typeId === attributeTypeId && a.value !== attributeValue)
        ).map(item => ({
            ...item,
            attributes: [...item.attributes.filter(a => a.typeId !== attributeTypeId), {typeId: attributeTypeId, value: attributeValue}],
        }));
        // set the ids to process for the counter
        this.store.dispatch(MultiEditActions.setItemIdsToProcess({itemIds: items.map(item => item.id)}));
        items.forEach(item => this.updateAndReadItem(item));
    }

    deleteAttributes(items: FullConfigurationItem[], attributeTypeId: string) {
        items = items.filter(item => item.attributes.findIndex(a => a.typeId === attributeTypeId) !== -1)
            .map(item => ({
                ...item,
                attributes: item.attributes.filter(a => a.typeId !== attributeTypeId),
            }));
        // set the ids to process for the counter
        this.store.dispatch(MultiEditActions.setItemIdsToProcess({itemIds: items.map(item => item.id)}));
        items.forEach(item => this.updateAndReadItem(item));
    }

    createConnections(items: FullConfigurationItem[], connTemplate: { ruleId: string; targetId: string; description: string; typeId: string}) {
        this.store.dispatch(MultiEditActions.setItemIdsToProcess({itemIds: items.map(item => item.id)}));
        items.filter(item => !item.connectionsToLower.find(c =>
            c.ruleId === connTemplate.ruleId && c.targetId === connTemplate.targetId && c.description === connTemplate.description))
            .forEach(item => {
                const connection: Connection = {
                    ruleId: connTemplate.ruleId,
                    upperItemId: item.id,
                    lowerItemId: connTemplate.targetId,
                    description: connTemplate.description,
                    typeId: connTemplate.typeId,
                };
                EditFunctions.createConnection(this.http, this.store, connection).pipe(
                    switchMap(() => ReadFunctions.fullConfigurationItem(this.http, this.store, item.id)),
                ).subscribe(this.itemUpdateSubscriber(item));
            }
        );
    }

    deleteConnections(connections: TargetConnections) {
        this.store.dispatch(MultiEditActions.setItemIdsToProcess({itemIds: connections.connectionInfos.map(c => c.sourceItemId)}));
        connections.connectionInfos.forEach(connection => {
            EditFunctions.deleteConnection(this.http, this.store, connection.connection.id).pipe(
                switchMap(() => ReadFunctions.fullConfigurationItem(this.http, this.store, connection.sourceItemId)),
            ).subscribe(this.itemUpdateSubscriber(undefined));
        });
    }

    deleteAllLinks(items: FullConfigurationItem[]) {
        items = items.filter(item => item.links && item.links.length > 0).map(item => ({
            ...item,
            links: [],
        }));
        this.store.dispatch(MultiEditActions.setItemIdsToProcess({itemIds: items.map(item => item.id)}));
        items.forEach(item => this.updateAndReadItem(item));
    }

    deleteLink(items: FullConfigurationItem[], uri: string) {
        items = items.filter(item => item.links && item.links.find(l => l.uri === uri)).map(item => ({
            ...item,
            links: item.links.filter(l => l.uri !== uri),
        }));
        this.store.dispatch(MultiEditActions.setItemIdsToProcess({itemIds: items.map(item => item.id)}));
        items.forEach(item => this.updateAndReadItem(item));
    }

    private updateAndReadItem(item: FullConfigurationItem) {
        EditFunctions.updateConfigurationItem(this.http, this.store, item).pipe(
            switchMap(updatedItem => ReadFunctions.fullConfigurationItem(this.http, this.store, updatedItem.id))
        ).subscribe(this.itemUpdateSubscriber(item));
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
                        subjectId: item.id,
                        message: 'adding link',
                        details: link.uri,
                    });
                }
            });
        });
    }

    private itemUpdateSubscriber = (item: FullConfigurationItem) => ({
        next: (updatedItem: FullConfigurationItem) => {
            this.store.dispatch(MultiEditActions.removeItemIdToProcess({ itemId: updatedItem.id }));
            this.store.dispatch(MultiEditActions.replaceSelectedItem({ item: updatedItem }));
        },
        error: (error: { message?: string; error?: { message?: string } }) => {
            this.log({
                subject: item.type + ': ' + item.name,
                subjectId: item.id,
                message: 'failed updating item',
                details: error.message ?? error.error?.message ?? JSON.stringify(error),
                severity: 1,
            });
        },
    });

    private clearLog() {
        this.store.dispatch(LogActions.clearLog());
    }

    private log(logEntry: LineMessage) {
        this.store.dispatch(LogActions.log({logEntry}));
    }
}
