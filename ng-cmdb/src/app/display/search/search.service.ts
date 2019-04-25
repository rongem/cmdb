import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { Subscription, Subject } from 'rxjs';

import { AttributeType } from 'src/app/shared/objects/attribute-type.model';
import { SearchContent } from './search-content.model';
import { DataAccessService } from 'src/app/shared/data-access.service';
import { ConfigurationItem } from 'src/app/shared/objects/configuration-item.model';

@Injectable()
export class SearchService {
    private searchableAttributeTypes: AttributeType[] = [];
    private resultList: ConfigurationItem[] = [];
    resultListChanged: Subject<ConfigurationItem[]> = new Subject<ConfigurationItem[]>();
    private searchSubscription: Subscription;

    constructor(private data: DataAccessService) {}

    setSearchableAttributeTypes(attributeTypes: AttributeType[]) {
        this.searchableAttributeTypes = attributeTypes;
    }

    getSeachableAttributeTypes() {
        return this.searchableAttributeTypes.slice();
    }

    attributeTypePresent(id: Guid): boolean {
        for (const attributeType of this.searchableAttributeTypes) {
            if (attributeType.typeId === id) {
                return true;
            }
        }
    }

    filterAttributes(attributes: FormGroup[]) {
        const posToDelete: number[] = [];
        for (const attribute of attributes) {
            if (!this.attributeTypePresent(attribute.get('AttributeTypeId').value)) {
                posToDelete.push(attributes.indexOf(attribute));
            }
        }
        posToDelete.reverse();
        for (const pos of posToDelete) {
            attributes.splice(pos, 1);
        }
    }

    search(searchForm: SearchContent) {
        this.searchSubscription = this.data.searchItems(searchForm).subscribe((foundItems: ConfigurationItem[]) => {
            this.resultList = foundItems;
            this.resultListChanged.next(this.resultList.slice());
            this.searchSubscription.unsubscribe();
            console.log(this.resultList);
        });
    }

    getResultList() {
        return this.resultList.slice();
    }
}
