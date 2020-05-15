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

export function getConfigurationItemsByTypeName(store: Store, http: HttpClient, typeName: string) {
    return store.pipe(
        select(MetaDataSelectors.selectSingleItemTypeByName, typeName),
        switchMap(itemType => ReadFunctions.fullConfigurationItemsByType(http, itemType.id)),
    );
}

function compareConnectionTypeTemplate(a: ConnectionTypeTemplate, b: ConnectionTypeTemplate) {
    return a.bottomUpName.toLocaleLowerCase() === b.bottomUpName.toLocaleLowerCase() &&
        a.topDownName.toLocaleLowerCase() === b.topDownName.toLocaleLowerCase();
}

export function findRule(ruleStores: RuleStore[], connectionType: ConnectionTypeTemplate, upperItemType: string, lowerItemType: string) {
    return ruleStores.find(rs => compareConnectionTypeTemplate(rs.connectionTypeTemplate, connectionType) &&
        rs.upperItemTypeName.toLocaleLowerCase() === upperItemType.toLocaleLowerCase() &&
        rs.lowerItemTypeName.toLocaleLowerCase() === lowerItemType.toLocaleLowerCase());
}
