import { HttpClient } from '@angular/common/http';
import { take, map } from 'rxjs/operators';
import { Action, Store } from '@ngrx/store';

import * as EditActions from './edit.actions';

import { CONFIGURATIONITEM, IMPORTDATATABLE, CONVERTFILETOTABLE, FULL, ATTRIBUTE, CONNECTION, RESPONSIBILITY, ITEMLINK } from '../../rest-api/rest-api.constants';
import { getUrl, getHeader, post, put, del } from '../../functions';
import { TransferTable } from '../../objects/item-data/transfer-table.model';
import { RestLineMessage } from '../../rest-api/line-message.model';
import { LineMessage } from '../../objects/item-data/line-message.model';
import { ConfigurationItem } from '../../objects/item-data/configuration-item.model';
import { ItemAttribute } from '../../objects/item-data/item-attribute.model';
import { FullConfigurationItem } from '../../objects/item-data/full/full-configuration-item.model';
import { Connection } from '../../objects/item-data/connection.model';
import { ItemLink } from '../../objects/item-data/item-link.model';
import { FullAttribute } from '../../objects/item-data/full/full-attribute.model';
import { Guid } from '../../guid';
import { AttributeType } from '../../objects/meta-data/attribute-type.model';

export function importDataTable(http: HttpClient, itemTypeId: string, table: TransferTable) {
    return http.put<RestLineMessage[]>(getUrl(IMPORTDATATABLE), {
        table: {
            columns: table.columns.map(c => ({
                number: c.number,
                name: c.name,
                caption: c.caption,
            })),
            rows: table.rows,
        },
        itemTypeId
      }, { headers: getHeader() }).pipe(
        take(1),
        map(messages => messages.map(m => new LineMessage(m))),
    );
}

export function uploadAndConvertFileToTable(http: HttpClient, file: File) {
    const formData: FormData = new FormData();
    formData.append('contentStream', file, file.name);
    return http.post<string[][]>(getUrl(CONVERTFILETOTABLE), formData).pipe(take(1));
}

export function createConfigurationItem(http: HttpClient, item: ConfigurationItem, successAction?: Action) {
    return post(http, CONFIGURATIONITEM,
        { item: {
            ItemId: item.id,
            ItemType: item.typeId,
            ItemName: item.name,
        }},
        successAction
    );
}

export function createFullConfigurationItem(http: HttpClient, item: FullConfigurationItem, successAction?: Action) {
    return post(http, CONFIGURATIONITEM + FULL.substr(1),
        { item: {
            id: item.id,
            typeId: item.typeId,
            name: item.name,
            attributes: item.attributes?.map(a => ({
                id: a.id,
                typeId: a.typeId,
                value: a.value,
            })),
            connectionsToUpper: item.connectionsToUpper?.map(c => ({
                id: c.id,
                typeId: c.typeId,
                ruleId: c.ruleId,
                targetId: c.targetId,
                description: c.description,
            })),
            connectionsToLower: item.connectionsToLower?.map(c => ({
                id: c.id,
                typeId: c.typeId,
                ruleId: c.ruleId,
                targetId: c.targetId,
                description: c.description,
            })),
            links: item.links?.map(l => ({
                id: l.id,
                uri: l.uri,
                description: l.description,
            })),
        }},
        successAction
    );
}

export function updateConfigurationItem(http: HttpClient, item: ConfigurationItem, successAction?: Action) {
    return put(http, CONFIGURATIONITEM + item.id,
        { item: {
            ItemId: item.id,
            ItemType: item.typeId,
            TypeName: item.type,
            ItemName: item.name,
            ItemLastChange: item.lastChange?.getTime() * 10000,
            ItemVersion: item.version,
        }},
        successAction
    );
}

export function deleteConfigurationItem(http: HttpClient, itemId: string, successAction?: Action) {
    return del(http, CONFIGURATIONITEM + itemId, successAction);
}

export function createItemAttribute(http: HttpClient, attribute: ItemAttribute, successAction?: Action) {
    return post(http, ATTRIBUTE,
        { attribute: {
            AttributeId: attribute.id,
            ItemId: attribute.itemId,
            AttributeTypeId: attribute.typeId,
            AttributeValue: attribute.value,
        }},
        successAction
    );
}

export function updateItemAttribute(http: HttpClient, attribute: ItemAttribute, successAction?: Action) {
    return put(http, ATTRIBUTE + attribute.id,
        { attribute: {
            AttributeId: attribute.id,
            ItemId: attribute.itemId,
            AttributeTypeId: attribute.typeId,
            AttributeTypeName: attribute.type,
            AttributeValue: attribute.value,
            AttributeLastChange: attribute.lastChange?.getTime() * 10000,
            AttributeVersion: attribute.version,
        }},
        successAction
    );
}

export function deleteItemAttribute(http: HttpClient, attributeId: string, successAction?: Action) {
    return del(http, ATTRIBUTE + attributeId, successAction);
}

export function createConnection(http: HttpClient, connection: Connection, successAction?: Action) {
    return post(http, CONNECTION,
        { connection: {
            ConnId: connection.id,
            ConnType: connection.typeId,
            ConnUpperItem: connection.upperItemId,
            ConnLowerItem: connection.lowerItemId,
            RuleId: connection.ruleId,
            Description: connection.description,
        }},
        successAction
    );
}

export function updateConnection(http: HttpClient, connection: Connection, successAction?: Action) {
    return put(http, CONNECTION + connection.id,
        { connection: {
            ConnId: connection.id,
            ConnType: connection.typeId,
            ConnUpperItem: connection.upperItemId,
            ConnLowerItem: connection.lowerItemId,
            RuleId: connection.ruleId,
            Description: connection.description,
        }},
        successAction
    );
}

export function deleteConnection(http: HttpClient, connectionId: string, successAction?: Action) {
    return del(http, CONNECTION + connectionId, successAction);
}

export function createItemLink(http: HttpClient, itemLink: ItemLink, successAction?: Action) {
    return post(http, ITEMLINK,
        { link: {
            LinkId: itemLink.id,
            ItemId: itemLink.itemId,
            LinkURI: itemLink.uri,
            LinkDescription: itemLink.description,
        }},
        successAction
    );
}

export function deleteItemLink(http: HttpClient, linkId: string, successAction?: Action) {
    return del(http, ITEMLINK + linkId, successAction);
}

export function takeResponsibility(http: HttpClient, itemId: string, successAction?: Action) {
    return post(http, CONFIGURATIONITEM + itemId + RESPONSIBILITY, undefined, successAction);
}

export function abandonResponsibility(http: HttpClient, itemId: string, successAction?: Action) {
    return del(http, CONFIGURATIONITEM + itemId + RESPONSIBILITY, successAction);
}

export function deleteInvalidResponsibility(http: HttpClient, itemId: string, userToken: string, successAction?: Action) {
    return put(http, CONFIGURATIONITEM + itemId + RESPONSIBILITY, { userToken }, successAction);
}

export function ensureAttribute(store: Store, item: FullConfigurationItem, attributeType: AttributeType, value: string) {
    if (!item.attributes) {
        item.attributes = [];
    }
    const attribute = item.attributes.find(a => a.typeId === attributeType.id);
    if (attribute) { // attribute exists
        if (!value || value === '') { // delete attribute
            store.dispatch(EditActions.deleteItemAttribute({itemAttribute: buildAttribute(item.id, attributeType, value,
            attribute.id)}));
        } else {
            if (attribute.value !== value) { // change attribute
            store.dispatch(EditActions.updateItemAttribute({itemAttribute: buildAttribute(item.id, attributeType, value,
                attribute.id, attribute.lastChange, attribute.version)}));
            }
        }
    } else if (value && value !== '') { // create attribute
        store.dispatch(EditActions.createItemAttribute({itemAttribute: buildAttribute(item.id, attributeType, value)}));
    }
}

function buildAttribute(itemId: string, attributeType: AttributeType, value: string, id: string = Guid.create().toString(),
                        lastChange: Date = new Date(), version: number = 0): ItemAttribute {
    return {
        id,
        lastChange,
        typeId: attributeType.id,
        type: attributeType.name,
        value,
        version,
        itemId,
    };
}

export function ensureItem(http: HttpClient,
                           item: ConfigurationItem | FullConfigurationItem,
                           expectedName: string,
                           successAction?: Action) {
    if (item.name !== expectedName) {
        if (item instanceof ConfigurationItem) {
            return updateConfigurationItem(http, {...item, name: expectedName}, successAction);
        } else if (item instanceof FullConfigurationItem) {
            return updateConfigurationItem(http, {
                id: item.id,
                name: expectedName,
                lastChange: item.lastChange,
                typeId: item.typeId,
                version: item.version,
            }, successAction);
        }
    }
    return null;
}
