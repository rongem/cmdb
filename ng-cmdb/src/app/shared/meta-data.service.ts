import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';
import { ItemAttribute } from './objects/item-attribute.model';
import { map } from 'rxjs/operators';
import { ItemType } from './objects/item-type.model';
import { resolve } from 'q';

@Injectable()
export class MetaDataService {

    private baseurl = 'http://localhost:51717/API/REST.svc/';
    // private attributeTypes: attributeType[];
    private itemTypes: ItemType[] = [];
    itemTypesChanged = new Subject<ItemType[]>();

    constructor(private http: HttpClient) { this.init(); }

    init() {
        this.fetchItemTypes();
    }

    getUrl(service: string) {
        return this.baseurl + service;
    }

    getAttributeTypes() {
        return this.http.get(this.getUrl('GetAttributeTypes'));
    }

    fetchItemTypes() {
        this.http.get<ItemAttribute[]>(this.getUrl('GetItemTypes')).pipe(
            map((ItemTypes: []) => {
                const itemTypes: ItemType[] = [];
                for (const el of ItemTypes) {
                    const ob: ItemType = new ItemType(el);
                    itemTypes.push(ob);
                }
                return itemTypes;
            })).subscribe((itemTypes: ItemType[]) => {
                this.setItemTypes(itemTypes);
            });
    }

    setItemTypes(itemTypes: ItemType[]) {
        this.itemTypes = itemTypes;
        this.itemTypesChanged.next(this.itemTypes.slice());
    }

    getItemTypes(): ItemType[] {
        return this.itemTypes.slice();
    }

}
