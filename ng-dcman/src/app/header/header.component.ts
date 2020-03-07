import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromSelectBasics from 'src/app/shared/store/basics/basics.selectors';
import * as fromSelectAsset from 'src/app/shared/store/asset/asset.selectors';
import * as MetaDataActions from 'src/app/shared/store/meta-data.actions';
import { AppState } from 'src/app/shared/store/app.reducer';
import { getRouterState } from '../shared/store/router/router.reducer';
import { map } from 'rxjs/operators';
import { Mappings } from '../shared/objects/appsettings/mappings.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
  }

  get route() {
    return this.store.select(getRouterState).pipe(map(state => state && state.state ? state.state.url.toLocaleLowerCase() : ''));
  }

  get rackMountables() {
    return Mappings.rackMountables;
  }

  get enclosureMountables() {
    return Mappings.enclosureMountables;
  }

  get metaDataState() {
    return this.store.select(fromSelectMetaData.selectState);
  }

  get basicsState() {
    return this.store.select(fromSelectBasics.selectState);
  }

  get assetState() {
    return this.store.select(fromSelectAsset.selectState);
  }

  get loadedAndReady() {
    return this.store.select(fromSelectAsset.ready);
  }

  get incompleteModels() {
    return this.store.select(fromSelectBasics.selectIncompleteModels);
  }

  get racksWithoutModel() {
    return this.store.select(fromSelectAsset.selectRacksWithoutModel);
  }

  get enclosuresWithoutModel() {
    return this.store.select(fromSelectAsset.selectEnclosuresWithoutModel);
  }

  get rackServersWithoutModel() {
    return this.store.select(fromSelectAsset.selectRackServersWithoutModel);
  }

  retry() {
    this.store.dispatch(MetaDataActions.readState({resetRetryCount: true}));
  }

}
