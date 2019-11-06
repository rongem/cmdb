import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { withLatestFrom } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromSelectMultiEdit from 'src/app/display/store/multi-edit.selectors';
import * as EditActions from 'src/app/display/store/edit.actions';

import { DisplayServiceModule } from '../display-service.module';
import { Guid } from 'src/app/shared/guid';
import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { ConnectionRule } from 'src/app/shared/objects/connection-rule.model';
import { ItemAttribute } from 'src/app/shared/objects/item-attribute.model';

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
                    const itemAttribute: ItemAttribute = {
                        AttributeId: att.id,
                        AttributeTypeId: att.typeId,
                        AttributeTypeName: att.type,
                        AttributeValue: att.value,
                        ItemId: item.id,
                        AttributeVersion: att.version,
                        AttributeLastChange: att.lastChange,
                    };
                    if (!attribute.attributeValue || attribute.attributeValue === '') {
                        // delete attribute
                        this.store.dispatch(EditActions.deleteItemAttribute({itemAttribute}));
                    } else {
                        // change attribute
                        if (att.value !== attribute.attributeValue) {
                            itemAttribute.AttributeValue = attribute.attributeValue;
                            this.store.dispatch(EditActions.updateItemAttribute({itemAttribute}));
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
                        this.store.dispatch(EditActions.createItemAttribute({itemAttribute}));
                    }
                }
            });
        });
    }

    deleteConnections(connections: {delete: boolean, targetId: Guid}[]) {
        connections.filter(connection => connection.delete).forEach(connection => {
            this.items.forEach(item => {

            });
        });
    }

    addConnections(connections: {add: boolean, ruleId: Guid, description: string, targetId: Guid}[]) {
        connections.filter(connection => connection.add).forEach(connection => {
            this.items.forEach(item => {

            });
        });
    }

    deleteLinks(links: {delete: boolean, target: string}[]) {
        links.filter(link => link.delete).forEach(link => {
            this.items.forEach(item => {

            });
        });
    }

    addLinks(links: {uri: string, description: string}[]) {
        links.forEach(link => {
            this.items.forEach(item => {

            });
        });
    }


}