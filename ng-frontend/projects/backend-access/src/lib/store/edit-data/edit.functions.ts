import { HttpClient } from '@angular/common/http';
import { take, map, concatMap, switchMap } from 'rxjs/operators';
import { Action } from '@ngrx/store';

import * as ReadFunctions from '../read-data/read.functions';

import { CONFIGURATIONITEM, IMPORTDATATABLE, CONVERTFILETOTABLE, FULL, ATTRIBUTE, CONNECTION, RESPONSIBILITY, ITEMLINK } from '../../old-rest-api/rest-api.constants';
import { getUrl, getHeader, post, put, del } from '../../functions';
import { TransferTable } from '../../objects/item-data/transfer-table.model';
import { RestLineMessage } from '../../old-rest-api/line-message.model';
import { LineMessage } from '../../objects/item-data/line-message.model';
import { ConfigurationItem } from '../../objects/item-data/configuration-item.model';
import { ItemAttribute } from '../../objects/item-data/item-attribute.model';
import { FullConfigurationItem } from '../../objects/item-data/full/full-configuration-item.model';
import { Connection } from '../../objects/item-data/connection.model';
import { ItemLink } from '../../objects/item-data/item-link.model';
import { Guid } from '../../guid';
import { AttributeType } from '../../objects/meta-data/attribute-type.model';
import { ConnectionRule } from '../../objects/meta-data/connection-rule.model';
import { AppConfigService } from '../../app-config/app-config.service';
import { RestItem } from '../../rest-api/item-data/item.model';

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
    return post(http, CONFIGURATIONITEM, AppConfigService.settings.backend.version === 1 ?
        { item: {
            ItemId: item.id,
            ItemType: item.typeId,
            ItemName: item.name,
        }} : {
            typeId: item.typeId,
            name: item.name,
            attributes: item.attributes ? item.attributes.map(a => ({
                typeId: a.typeId,
                value: a.value,
            })) : [],
            links: item.links ? item.links.map(l => ({
                uri: l.uri,
                description: l.description,
            })) : [],
            responsibleUsers: item.responsibleUsers ?? [],
        },
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
    return put(http, CONFIGURATIONITEM + item.id, AppConfigService.settings.backend.version === 1 ?
        { item: {
            ItemId: item.id,
            ItemType: item.typeId,
            TypeName: item.type,
            ItemName: item.name,
            ItemLastChange: item.lastChange?.getTime() * 10000,
            ItemVersion: item.version,
        }} : {
            id: item.id,
            typeId: item.typeId,
            name: item.name,
            typeName: item.type,
            lastChange: item.lastChange,
            version: item.version,
            attributes: item.attributes ? item.attributes.map(a => ({
                typeId: a.typeId,
                value: a.value,
            })) : [],
            links: item.links ? item.links.map(l => ({
                uri: l.uri,
                description: l.description,
            })) : [],
            responsibleUsers: item.responsibleUsers,
        },
        successAction
    );
}

export function deleteConfigurationItem(http: HttpClient, itemId: string, successAction?: Action) {
    return del(http, CONFIGURATIONITEM + itemId, successAction);
}

export function createItemAttribute(http: HttpClient, attribute: ItemAttribute, successAction?: Action) {
    if (AppConfigService.settings.backend.version === 1) {
        return post(http, ATTRIBUTE,
            { attribute: {
                AttributeId: attribute.id,
                ItemId: attribute.itemId,
                AttributeTypeId: attribute.typeId,
                AttributeValue: attribute.value,
            }},
            successAction
        );
    } else {
        return ReadFunctions.configurationItem(http, attribute.itemId).pipe(
            switchMap(item => {
                if (!item.attributes) {
                    item.attributes = [];
                }
                item.attributes.push({
                    id: undefined,
                    itemId: attribute.itemId,
                    typeId: attribute.typeId,
                    value: attribute.value,
                });
                return updateConfigurationItem(http, item, successAction);
            })
        );
    }
}

export function updateItemAttribute(http: HttpClient, attribute: ItemAttribute, successAction?: Action) {
    if (AppConfigService.settings.backend.version === 1) {
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
    } else {
        return ReadFunctions.configurationItem(http, attribute.itemId).pipe(
            switchMap(item => {
                const att = item.attributes.find(a => a.id === attribute.id);
                if (att) {
                    att.value = attribute.value;
                }
                return updateConfigurationItem(http, item, successAction);
            })
        );
    }
}

export function deleteItemAttribute(http: HttpClient, attributeId: string, successAction?: Action) {
    if (AppConfigService.settings.backend.version === 1) {
        return del(http, ATTRIBUTE + attributeId, successAction);
    } else {
        return del(http, CONFIGURATIONITEM + ATTRIBUTE + attributeId, successAction);
    }
}

export function createConnection(http: HttpClient, connection: Connection, successAction?: Action) {
    return post(http, CONNECTION, AppConfigService.settings.backend.version === 1 ?
        { connection: {
            ConnId: connection.id,
            ConnType: connection.typeId,
            ConnUpperItem: connection.upperItemId,
            ConnLowerItem: connection.lowerItemId,
            RuleId: connection.ruleId,
            Description: connection.description,
        }} : {
            id: connection.id,
            typeId: connection.typeId,
            upperItemId: connection.upperItemId,
            lowerItemId: connection.lowerItemId,
            ruleId: connection.ruleId,
            description: connection.description,
        },
        successAction
    );
}

export function updateConnection(http: HttpClient, connection: Connection, successAction?: Action) {
    return put(http, CONNECTION + connection.id, AppConfigService.settings.backend.version === 1 ?
        { connection: {
            ConnId: connection.id,
            ConnType: connection.typeId,
            ConnUpperItem: connection.upperItemId,
            ConnLowerItem: connection.lowerItemId,
            RuleId: connection.ruleId,
            Description: connection.description,
        }} : {
            id: connection.id,
            typeId: connection.typeId,
            upperItemId: connection.upperItemId,
            lowerItemId: connection.lowerItemId,
            ruleId: connection.ruleId,
            description: connection.description,
        },
        successAction
    );
}

export function deleteConnection(http: HttpClient, connectionId: string, successAction?: Action) {
    return del(http, CONNECTION + connectionId, successAction);
}

export function createItemLink(http: HttpClient, itemLink: ItemLink, successAction?: Action) {
    if (AppConfigService.settings.backend.version === 1) {
        return post(http, ITEMLINK, AppConfigService.settings.backend.version === 1 ?
            { link: {
                LinkId: itemLink.id,
                ItemId: itemLink.itemId,
                LinkURI: itemLink.uri,
                LinkDescription: itemLink.description,
            }} : { // tbd
            },
            successAction
        );
    } else {
        return ReadFunctions.configurationItem(http, itemLink.itemId).pipe(
            switchMap(item => {
                if (!item.links) {
                    item.links = [];
                }
                item.links.push({
                    id: undefined,
                    itemId: itemLink.itemId,
                    uri: itemLink.uri,
                    description: itemLink.description,
                });
                return updateConfigurationItem(http, item, successAction);
            })
        );
    }
}

export function deleteItemLink(http: HttpClient, linkId: string, successAction?: Action) {
    if (AppConfigService.settings.backend.version === 1) {
        return del(http, ITEMLINK + linkId, successAction);
    } else {
        return del(http, CONFIGURATIONITEM + ITEMLINK + linkId, successAction);
    }
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

export function ensureAttribute(http: HttpClient, item: FullConfigurationItem,
                                attributeType: AttributeType, value: string, successAction?: Action) {
    if (!item.attributes) {
        item.attributes = [];
    }
    const attribute = item.attributes.find(a => a.typeId === attributeType.id);
    if (attribute) { // attribute exists
        if (!value || value === '') { // delete attribute
            return deleteItemAttribute(http, attribute.id, successAction);
        } else {
            if (attribute.value !== value) { // change attribute
                return updateItemAttribute(http, buildAttribute(item.id, attributeType, value,
                    attribute.id, attribute.lastChange, attribute.version), successAction);
            }
        }
    } else if (value && value !== '') { // create attribute
        return createItemAttribute(http, buildAttribute(item.id, attributeType, value), successAction);
    }
    return null;
}

function buildAttribute(itemId: string, attributeType: AttributeType, value: string,
                        id: string = AppConfigService.settings.backend.version === 1 ? Guid.create().toString() : undefined,
                        lastChange?: Date, version?: number): ItemAttribute {
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
                typeId: item.typeId,
                lastChange: item.lastChange,
                version: item.version,
            }, successAction);
        }
    }
    return null;
}

// identifies a connection by rule id, which means that only one connection with this rule id is allowed
// or the function will fail
export function ensureUniqueConnectionToLower(http: HttpClient,
                                              item: FullConfigurationItem,
                                              connectionRule: ConnectionRule,
                                              targetItemId: string,
                                              description: string,
                                              successAction?: Action) {
    if (!item.connectionsToLower) {
        item.connectionsToLower = [];
    }
    if (item.connectionsToLower.filter(c => c.ruleId === connectionRule.id).length > 1) {
        return null;
    }
    const conn = item.connectionsToLower.find(c => c.ruleId === connectionRule.id);
    if (conn) {
        // connection exists
        if (conn.targetId === targetItemId) {
            // connection is pointing to the correct target
            if (conn.description !== description) {
                return updateConnection(http, buildConnection(conn.id, item.id, conn.typeId, conn.targetId, conn.ruleId, description),
                    successAction);
            }
        } else {
            // connection must be deleted and a new one created
            return deleteConnection(http, conn.id, successAction).pipe(
                concatMap(() => createConnection(http, buildConnection(
                    AppConfigService.settings.backend.version === 1 ? Guid.create().toString() : undefined,
                    item.id, connectionRule.connectionTypeId,
                    targetItemId, connectionRule.id, description), successAction)),
            );
        }
    } else {
        return createConnection(http, buildConnection(AppConfigService.settings.backend.version === 1 ?
            Guid.create().toString() : undefined,
            item.id, connectionRule.connectionTypeId, targetItemId, connectionRule.id, description), successAction);
    }
    return null;
}

function buildConnection(id: string, upperItemId: string, typeId: string, lowerItemId: string, ruleId: string,
                         description: string): Connection {
    return {
        id,
        upperItemId,
        typeId,
        lowerItemId,
        ruleId,
        description,
    };
}
