import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { MetaDataSelectors, ReadFunctions } from 'backend-access';

import { Store, select } from '@ngrx/store';

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
        switchMap(itemType => ReadFunctions.getFullConfigurationItemsByType(http, itemType.id)),
    );
}
