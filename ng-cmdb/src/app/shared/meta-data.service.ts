import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import * as fromApp from './store/app.reducer';
import { getUrl, getHeader } from './store/functions';
import { AttributeType } from './objects/attribute-type.model';
import { ItemAttribute } from './objects/item-attribute.model';
import { ItemType } from './objects/item-type.model';
import { ConfigurationItem } from './objects/configuration-item.model';
import { ItemTypeAttributeGroupMapping } from './objects/item-type-attribute-group-mapping.model';

const ATTRIBUTETYPE = 'AttributeType/';
const ATTRIBUTES = '/Attributes';
const CONFIGURATIONITEMSBYTYPE = 'ConfigurationItems/ByType';
const ITEMTYPEATTRIBUTEGROUPMAPPING = 'ItemTypeAttributeGroupMapping/group/';

@Injectable({providedIn: 'root'})
export class MetaDataService {
    constructor(private store: Store<fromApp.AppState>,
                private http: HttpClient) {}

    getAttributesForAttributeType(attributeType: AttributeType) {
        return this.http.get<ItemAttribute[]>(getUrl(ATTRIBUTETYPE + attributeType.TypeId + ATTRIBUTES));
    }

    getItemsForItemType(itemType: ItemType) {
        return this.http.post<ConfigurationItem[]>(getUrl(CONFIGURATIONITEMSBYTYPE), {
            typeIds: [ itemType.TypeId ] }, { headers: getHeader() });
    }

    canDeleteMapping(itemTypeAttributeGroupMapping: ItemTypeAttributeGroupMapping) {
        return this.http.get<boolean>(getUrl(ITEMTYPEATTRIBUTEGROUPMAPPING +
            itemTypeAttributeGroupMapping.GroupId + '/itemType/' +
            itemTypeAttributeGroupMapping.ItemTypeId + '/CanDelete'));
    }

    countMapping(itemTypeAttributeGroupMapping: ItemTypeAttributeGroupMapping) {
        return this.http.get<number>(getUrl(ITEMTYPEATTRIBUTEGROUPMAPPING +
            itemTypeAttributeGroupMapping.GroupId + '/itemType/' +
            itemTypeAttributeGroupMapping.ItemTypeId + '/CountAttributes'));
    }
}
