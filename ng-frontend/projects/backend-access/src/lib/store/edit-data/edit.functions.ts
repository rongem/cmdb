import { HttpClient } from '@angular/common/http';
import { take, map } from 'rxjs/operators';
import { Action } from '@ngrx/store';

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

export function ensureAttribute(http: HttpClient,
                                attribute: ItemAttribute | {attributeTypeId: string, itemId: string},
                                expectedValue: string,
                                successAction?: Action) {
    if (attribute instanceof ItemAttribute) {
        if (attribute.value !== expectedValue) {
            return updateItemAttribute(http, {...attribute, value: expectedValue}, successAction);
        }
    } else {
        return createItemAttribute(http, {
            id: Guid.create().toString(),
            itemId: attribute.itemId,
            typeId: attribute.attributeTypeId,
            value: expectedValue,
            lastChange: new Date(),
            version: 0,
        }, successAction);
    }
    return null;
}

export function buildAttribute(attribute: FullAttribute, itemId: string, expectedValue?: string): ItemAttribute {
    return {
        id: attribute.id,
        itemId,
        lastChange: attribute.lastChange,
        typeId: attribute.typeId,
        version: attribute.version,
        value: expectedValue ? expectedValue : attribute.value,
    };
}

export function ensureItem(http: HttpClient,
                           item: ConfigurationItem | FullConfigurationItem,
                           expectedName: string,
                           successAction?: Action) {
    if (item instanceof ConfigurationItem) {
        if (item.name !== expectedName) {
            return updateConfigurationItem(http, {...item, name: expectedName}, successAction);
        }
    } else if (item instanceof FullConfigurationItem) {
        if (item.name !== expectedName) {
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
