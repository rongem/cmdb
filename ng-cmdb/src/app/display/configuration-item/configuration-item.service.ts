import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Guid } from 'guid-typescript';

import * as ConfigurationItemActions from './store/configuration-item.actions';

import { MetaDataService } from '../../shared/meta-data.service';
import { DataAccessService } from '../../shared/data-access.service';
import * as fromApp from 'src/app/shared/store/app.reducer';

@Injectable()
export class ConfigurationItemService {
    private itemId: Guid;

    constructor(private router: Router,
                private meta: MetaDataService,
                private store: Store<fromApp.AppState>,
                private data: DataAccessService) {
    }

    reload() {
        const guid = this.itemId;
        this.itemId = null;
        this.getItem(guid);
    }

    // Holt ein vollständiges Item und leitet bei Fehlern zur Suche umm
    getItem(guid: Guid) {
        if (this.itemId && this.itemId === guid) {
            return;
        }
        this.data.fetchFullConfigurationItem(guid).subscribe(v => {
            this.store.dispatch(new ConfigurationItemActions.SetItem(v));
        }, error => {
            this.itemId = undefined;
            this.store.dispatch(new ConfigurationItemActions.ClearItem());
            this.router.navigate(['display', 'configuration-item', 'search']);
        });
    }

    clear() {
        this.store.dispatch(new ConfigurationItemActions.ClearItem());
    }
}
