import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';

import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromSelectBasics from 'src/app/shared/store/basics/basics.selectors';
import * as fromSelectAsset from 'src/app/shared/store/asset/asset.selectors';
import * as MetaDataActions from 'src/app/shared/store/meta-data.actions';

import { AppState } from 'src/app/shared/store/app.reducer';
import { getRouterState } from 'src/app/shared/store/router/router.reducer';
import { Mappings } from 'src/app/shared/objects/appsettings/mappings.model';
import { AppConfigService } from 'src/app/shared/app-config.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
  itemTypeNames = Object.values(AppConfigService.objectModel.ConfigurationItemTypeNames);
  lowerNames = this.itemTypeNames.map(n => n.toLocaleLowerCase());

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
  }

  get itemList() {
    return this.store.pipe(
      select(fromSelectAsset.selectAllItems),
      withLatestFrom(this.route),
      map(([items, router]) => {
        if (router.fragment === 'without-model') {
          items = items.filter(i => !i.model);
        } else if (router.fragment && this.lowerNames.includes(router.fragment.toLocaleLowerCase())) {
          items = items.filter(i => i.assetType.name.toLocaleLowerCase() === router.fragment.toLocaleLowerCase());
        }
        if (router.queryParams.name ) {
          items = items.filter(i => i.name.toLocaleLowerCase().includes(router.queryParams.name.toLocaleLowerCase()));
        }
        return items;
      }),
    );
  }

  get route() {
    return this.store.pipe(
      select(getRouterState),
      map(routerState => routerState.state),
    );
  }

}
