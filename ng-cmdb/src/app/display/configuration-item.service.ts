import { Injectable } from '@angular/core';
import { Subscription, Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Guid } from 'guid-typescript';

import { ConfigurationItem } from '../shared/objects/configuration-item.model';
import { ItemAttribute } from '../shared/objects/item-attribute.model';
import { MetaDataService } from '../shared/meta-data.service';
import { DataAccessService } from '../shared/data-access.service';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class ConfigurationItemService {
    private itemType: Guid;
    private itemId: Guid;
    private itemPromise: Promise<ConfigurationItem>;
    private item: ConfigurationItem;
    private attributes: ItemAttribute[];
    private attributePromise: Promise<ItemAttribute[]>;
    private connectionsToUpperSubscription: Subscription;
    private connectionsToLowerSubscription: Subscription;
    itemChanged = new Subject<ConfigurationItem>();
    attributesChanged = new Subject<ItemAttribute[]>();

    constructor(private router: Router,
                private meta: MetaDataService,
                private data: DataAccessService) {}

    getItem(guid: Guid): Promise<ConfigurationItem> | ConfigurationItem {
        if (this.itemPromise) {
            return this.itemPromise;
        }
        if (this.itemId && this.itemId === guid) {
            return this.item;
        }
        this.attributes = null;
        this.itemPromise = this.data.fetchConfigurationItem(guid)
            .toPromise()
            .then((value: ConfigurationItem) => {
                this.itemId = value.ItemId;
                this.getItemAttributes();
                return this.setItem(value);
            })
            .catch((reason: any) => {
                this.item = undefined;
                this.itemId = undefined;
                this.router.navigate(['display', 'configuration-item', 'new']);
                return undefined;
            })
            .finally(() => { this.itemPromise = undefined; });
        return this.itemPromise;
    }

    private setItem(item: ConfigurationItem) {
        this.item = item;
        this.itemChanged.next(item);
        return this.item;
    }

    getItemAttributes(): Promise<ItemAttribute[]> | ItemAttribute[] {
        if (this.attributePromise) {
            return this.attributePromise;
        }
        if (this.attributes) {
            return this.attributes.slice();
        }
        if (this.itemId) {
            return this.attributePromise = this.data.fetchAttributesForItem(this.itemId)
                .toPromise()
                .then((value: ItemAttribute[]) => {
                    return this.setAttributes(value);
                })
                .catch((reason: any) => {
                    return this.setAttributes([]);
                })
                .finally(() => { this.attributePromise = undefined; });
        }
    }

    private setAttributes(attributes: ItemAttribute[]) {
        this.attributes = attributes;
        this.attributesChanged.next(attributes.slice());
        return this.attributes.slice();
    }
}
