/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs';
import { MetaDataSelectors, ReadFunctions, AttributeType, ConfigurationItem } from 'backend-access';

import { ConnectionTypeTemplate } from '../objects/appsettings/app-object.model';
import { RuleStore } from '../objects/appsettings/rule-store.model';

export function toHex(value: number) {
    const ret = value.toString(16);
    return ret.length === 1 ? '0' + ret : ret;
}

export function fromHex(value: string) {
    if (value.startsWith('#')) {
        value = value.substring(1);
    }
    return parseInt(value, 16);
}

// locale lower case compare abbreviation
export function llcc(a: string, b: string): boolean {
    return a.toLocaleLowerCase() === b.toLocaleLowerCase();
}

// locale lower case abbreviation
export function llc(a: string): string {
    return a.toLocaleLowerCase();
}

export function getConfigurationItemsByTypeName(store: Store, http: HttpClient, typeName: string) {
    return store.select(MetaDataSelectors.selectSingleItemTypeByName(typeName)).pipe(
        switchMap(itemType => ReadFunctions.fullConfigurationItemsByType(http, store, itemType.id)),
    );
}

function compareConnectionTypeTemplate(a: ConnectionTypeTemplate, b: ConnectionTypeTemplate) {
    return llcc(a.bottomUpName, b.bottomUpName) && llcc(a.topDownName, b.topDownName);
}

export function findRule(ruleStores: RuleStore[], connectionType: ConnectionTypeTemplate, upperItemType: string, lowerItemType: string) {
    return ruleStores.find(rs => compareConnectionTypeTemplate(rs.connectionTypeTemplate, connectionType) &&
        llcc(rs.upperItemTypeName, upperItemType) && llcc(rs.lowerItemTypeName, lowerItemType));
}

export function ensureAttribute(item: ConfigurationItem, attributeTypes: AttributeType[], typeName: string, expectedValue: string, changed: boolean) {
    const attributeType = attributeTypes.find(at => llcc(at.name, typeName));
    if (!item.attributes) {
        item.attributes = [];
    }
    const attribute = item.attributes.find(a => a.typeId === attributeType.id);
    if (attribute) {
        if (!expectedValue || expectedValue.trim() === '') { // delete attribute
            item.attributes.splice(item.attributes.findIndex(a => a.typeId === attributeType.id), 1);
            changed = true;
        } else if (attribute.value !== expectedValue) {
            attribute.value = expectedValue;
            changed = true;
        }
    } else if (!expectedValue || expectedValue.trim() === '') {
        item.attributes.push({
            typeId: attributeType.id,
            type: attributeType.name,
            value: expectedValue,
        });
        changed = true;
    }
    return changed;
}

