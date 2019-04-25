import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { ItemType } from './objects/item-type.model';
import { AttributeType } from './objects/attribute-type.model';
import { AttributeGroup } from './objects/attribute-group.model';
import { Guid } from 'guid-typescript';

@Injectable()
export class MetaDataService {

    private attributeGroups: AttributeGroup[] = [];
    private attributeTypes: AttributeType[] = [];
    private itemTypes: ItemType[] = [];
    attributeGroupsChanged = new Subject<AttributeGroup[]>();
    attributeTypesChanged = new Subject<AttributeType[]>();
    itemTypesChanged = new Subject<ItemType[]>();


    // getAttributeTypes() {
    //     return this.http.get(this.getUrl('GetAttributeTypes'));
    // }

    setItemTypes(itemTypes: ItemType[]) {
        this.itemTypes = itemTypes;
        this.itemTypesChanged.next(this.itemTypes.slice());
    }

    getItemTypes(): ItemType[] {
        return this.itemTypes.slice();
    }

    getItemType(id: Guid): ItemType {
        for (const itemType of this.itemTypes) {
            if (itemType.typeId === id) {
                return itemType;
            }
        }
    }

    setAttributeGroups(attributeGroups: AttributeGroup[]) {
        this.attributeGroups = attributeGroups;
        this.attributeGroupsChanged.next(this.attributeGroups.slice());
    }

    setAttributeTypes(attributeTypes: AttributeType[]) {
        this.attributeTypes = attributeTypes;
        this.attributeTypesChanged.next(this.attributeTypes.slice());
    }

    getAttributeTypes(): AttributeType[] {
        return this.attributeTypes.slice();
    }

    getAttributeType(id: Guid): AttributeType {
        for (const attributeType of this.attributeTypes) {
            if (attributeType.typeId === id) {
                return attributeType;
            }
        }
    }
}
