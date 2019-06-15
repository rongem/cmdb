import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, from, combineLatest, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Guid } from 'guid-typescript';

import * as ConfigurationItemActions from './store/configuration-item.actions';

import { ConfigurationItem } from '../../shared/objects/configuration-item.model';
import { ItemAttribute } from '../../shared/objects/item-attribute.model';
import { MetaDataService } from '../../shared/meta-data.service';
import { DataAccessService } from '../../shared/data-access.service';
import { UserInfo } from '../../shared/objects/user-info.model';
import { Connection } from '../../shared/objects/connection.model';
import { AppState, CONFIGITEM } from 'src/app/shared/store/app-state.interface';
import { map, mergeAll, mergeMap } from 'rxjs/operators';

@Injectable()
export class ConfigurationItemService {
    private itemId: Guid;
    connectionsToLower: Connection[];
    connectionsToUpper: Connection[];
    itemReady: boolean;

    constructor(private router: Router,
                private meta: MetaDataService,
                private store: Store<AppState>,
                private data: DataAccessService) {
        this.store.select(CONFIGITEM).subscribe(value => {
            this.connectionsToLower = value.connectionsToLower;
            this.connectionsToUpper = value.connectionsToUpper;
            this.itemReady = value.itemReady;
        })
    }

    reload() {
        const guid = this.itemId;
        this.itemId = null;
        this.getItem(guid);
    }

    getItem(guid: Guid) {
        if (this.itemId && this.itemId === guid) {
            return;
        }
        forkJoin({
            item: this.data.fetchConfigurationItem(guid),
            attributes: this.data.fetchAttributesForItem(guid),
            connectionsToUpper: this.data.fetchConnectionsToUpperForItem(guid),
            connectionsToLower: this.data.fetchConnectionsToLowerForItem(guid),
        }).subscribe(value => {
            this.store.dispatch(new ConfigurationItemActions.SetItem(value.item));
            this.store.dispatch(new ConfigurationItemActions.SetAttributes(value.attributes));
            this.store.dispatch(new ConfigurationItemActions.SetConnectionsToLower(value.connectionsToLower));
            this.store.dispatch(new ConfigurationItemActions.SetConnectionsToUpper(value.connectionsToUpper));
            const itemIds = [...value.connectionsToLower.map(v => v.ConnLowerItem),
                ...value.connectionsToUpper.map(v => v.ConnUpperItem)];
            forkJoin({
                responsibilites: this.data.fetchUserInfo(value.item.ResponsibleUsers),
                connectedItems: forkJoin(this.getItems(itemIds)),
            }).subscribe(extravalue => {
                this.store.dispatch(new ConfigurationItemActions.SetResponsibilities(extravalue.responsibilites));
                const items: Map<Guid, ConfigurationItem> = new Map<Guid, ConfigurationItem>();
                extravalue.connectedItems.forEach(item => items.set(item.ItemId, item));
                this.store.dispatch(new ConfigurationItemActions.SetConnectedItems(items));
                this.store.dispatch(new ConfigurationItemActions.SetItemReady());
            });
        }, error => {
            this.itemId = undefined;
            this.store.dispatch(new ConfigurationItemActions.SetItem(null));
            this.router.navigate(['display', 'configuration-item', 'search']);
        });
    }

    getItems(guids: Guid[]) {
        const ret: Observable<ConfigurationItem>[] = [];
        guids.forEach(id => ret.push(this.data.fetchConfigurationItem(id)));
        return ret;
    }

    getConnectionsCount() {
        let ret = 0;
        if (Array.isArray(this.connectionsToLower)) {
            ret += this.connectionsToLower.length;
        }
        if (Array.isArray(this.connectionsToUpper)) {
            ret += this.connectionsToUpper.length;
        }
        return ret;
    }

    getLowerItemTypeName(ruleId: Guid) {
        const rule = this.meta.getConnectionRule(ruleId);
        if (rule) {
            const itemType = this.meta.getItemType(rule.ItemLowerType);
            if (itemType) {
                return itemType.TypeName;
            }
        }
    }

    getUpperItemTypeName(ruleId: Guid) {
        const rule = this.meta.getConnectionRule(ruleId);
        if (rule) {
            const itemType = this.meta.getItemType(rule.ItemUpperType);
            if (itemType) {
                return itemType.TypeName;
            }
        }
    }
}
