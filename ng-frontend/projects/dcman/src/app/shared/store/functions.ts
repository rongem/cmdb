import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { MetaDataSelectors, ReadFunctions } from 'backend-access';

import { Store, select } from '@ngrx/store';
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
    return store.pipe(
        select(MetaDataSelectors.selectSingleItemTypeByName, typeName),
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
