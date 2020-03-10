import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map, withLatestFrom, switchMap } from 'rxjs/operators';

import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromSelectBasics from 'src/app/shared/store/basics/basics.selectors';
import * as fromSelectAsset from 'src/app/shared/store/asset/asset.selectors';
import * as MetaDataActions from 'src/app/shared/store/meta-data.actions';

import { AppState } from 'src/app/shared/store/app.reducer';
import { getRouterState } from 'src/app/shared/store/router/router.reducer';
import { Mappings } from 'src/app/shared/objects/appsettings/mappings.model';
import { AppConfigService } from 'src/app/shared/app-config.service';
import { Guid } from 'src/app/shared/guid';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
  }

  get route() {
    return this.store.pipe(
      select(getRouterState),
      map(routerState => routerState.state),
    );
  }

  get item() {
    return this.route.pipe(
      map(state => state.params.id),
      switchMap((id: Guid) => this.store.select(fromSelectAsset.selectItem, id)),
    );
  }

}
