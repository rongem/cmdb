import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { switchMap, take} from 'rxjs';
import { AttributeType, Connection, ConnectionRule, EditFunctions, ErrorActions, FullConfigurationItem, ItemLink, ReadFunctions } from 'backend-access';
import { MultiEditActions } from '../../shared/store/store.api';
import { EditServiceModule } from '../edit-service.module';
import { TargetConnections } from '../objects/target-connections.model';

@Injectable({providedIn: EditServiceModule})
export class MultiEditService {
    constructor(private store: Store, private http: HttpClient) {}

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
                ).subscribe(this.itemUpdateSubscriber());
            }
        );
    }

    deleteConnections(connections: TargetConnections) {
        this.store.dispatch(MultiEditActions.setItemIdsToProcess({itemIds: connections.connectionInfos.map(c => c.sourceItemId)}));
        connections.connectionInfos.forEach(connection => {
            EditFunctions.deleteConnection(this.http, this.store, connection.connection.id).pipe(
                switchMap(() => ReadFunctions.fullConfigurationItem(this.http, this.store, connection.sourceItemId)),
            ).subscribe(this.itemUpdateSubscriber());
        });
    }

    addLink(items: FullConfigurationItem[], link: ItemLink) {
        items = items.filter(item => !item.links || !item.links.find(l => l.uri === link.uri && l.description === link.description)).map(item => ({
            ...item,
            links: [...item.links?.filter(l => l.uri !== link.uri), link],
        }));
        this.store.dispatch(MultiEditActions.setItemIdsToProcess({itemIds: items.map(item => item.id)}));
        items.forEach(item => this.updateAndReadItem(item));
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

    deleteItems(items: FullConfigurationItem[]) {
        this.store.dispatch(MultiEditActions.setItemIdsToProcess({itemIds: items.map(item => item.id)}));
        items.forEach(item => {
            EditFunctions.deleteConfigurationItem(this.http, this.store, item.id).pipe(take(1)).subscribe(deletedItem => {
                this.store.dispatch(MultiEditActions.removeItemId({itemId: deletedItem.id}));
                this.store.dispatch(MultiEditActions.removeSelectedItem({item}));
            });
        });
    }

    updateItems(items: FullConfigurationItem[], columns: string[], lines: string[][], attributeTypes: AttributeType[], connectionRules: ConnectionRule[]) {
        this.store.dispatch(MultiEditActions.setItemIdsToProcess({itemIds: items.map(item => item.id)}));
        const errors = new Map<string, string[]>();
        items.forEach((item, index) => {
            const line = lines[index];
            let changed = false;
            let updatedItem = {...item};
            columns.forEach((c, colIndex) => {
                const value = line[colIndex].trim();
                if (c === 'name') {
                    if (updatedItem.name !== value) {
                        updatedItem = {
                            ...updatedItem,
                            name: value,
                        };
                        changed = true;
                    }
                } else if (c.startsWith('a:')) {
                    const typeId = c.split(':')[1];
                    const attribute = updatedItem.attributes.find(a => a.typeId === typeId);
                    const attributeType = attributeTypes.find(a => a.id === typeId);
                    if (!!value) {
                        if (!new RegExp(attributeType.validationExpression).test(value)) {
                            if (!errors.has(item.id)) {
                                errors.set(item.id, [c]);
                            } else {
                                errors.get(item.id).push(c);
                            }
                        } else if (!attribute) {
                            updatedItem = {
                                ...updatedItem,
                                attributes: [...updatedItem.attributes, {typeId, value}],
                            };
                            changed = true;
                        } else if (attribute.value !== value) {
                            updatedItem = {
                                ...updatedItem,
                                attributes: [...updatedItem.attributes.filter(a => a.typeId !== typeId), {typeId, value}],
                            };
                            changed = true;
                        }
                    } else {
                        if (!!attribute) {
                            updatedItem = {
                                ...updatedItem,
                                attributes: updatedItem.attributes.filter(a => a.typeId !== typeId),
                            };
                            changed = true;
                        }
                    }
                }
            });
            if (changed) {
                this.updateAndReadItem(updatedItem);
            } else {
                this.store.dispatch(MultiEditActions.removeItemIdToProcess({itemId: item.id}));
            }
        });
        return errors;
    }

    private updateAndReadItem(item: FullConfigurationItem) {
        EditFunctions.updateConfigurationItem(this.http, this.store, item).pipe(
            switchMap(updatedItem => ReadFunctions.fullConfigurationItem(this.http, this.store, updatedItem.id))
        ).subscribe(this.itemUpdateSubscriber());
    }

    private itemUpdateSubscriber = () => ({
        next: (updatedItem: FullConfigurationItem) => {
            this.store.dispatch(MultiEditActions.removeItemIdToProcess({ itemId: updatedItem.id }));
            this.store.dispatch(MultiEditActions.replaceSelectedItem({ item: updatedItem }));
        },
        error: (error: { message?: string; error?: { message?: string } }) => {
            this.store.dispatch(ErrorActions.error({error, fatal: false}));
        },
    });
}
