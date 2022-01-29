import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { MetaDataSelectors, MetaDataActions, ErrorSelectors } from 'backend-access';

import * as fromSelectBasics from '../shared/store/basics/basics.selectors';
import * as fromSelectAsset from '../shared/store/asset/asset.selectors';
import * as fromSelectProvisionable from '../shared/store/provisionable/provisionable.selectors';
import * as BasicsActions from '../shared/store/basics/basics.actions';

import { AppState } from '../shared/store/app.reducer';
import { getRouterState } from '../shared/store/router/router.reducer';
import { Mappings } from '../shared/objects/appsettings/mappings.model';
import { ExtendedAppConfigService } from '../shared/app-config.service';
import { llc } from '../shared/store/functions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  menuOpen = false;

  constructor(private store: Store<AppState>) { }

  get route() {
    return this.store.select(getRouterState).pipe(map(state => state && state.state ? llc(state.state.url) : ''));
  }

  get rackMountables() {
    return Mappings.rackMountables.filter(rm =>
      rm !== llc(ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BladeEnclosure)
    );
  }

  get enclosureMountables() {
    return Mappings.enclosureMountables;
  }

  get metaDataState() {
    return this.store.select(MetaDataSelectors.selectState);
  }

  get recentError() {
    return this.store.select(ErrorSelectors.selectRecentError);
  }

  get allErrors() {
    return this.store.select(ErrorSelectors.selectAllErrors);
  }

  get errorIsFatal() {
    return this.store.select(ErrorSelectors.selectErrorIsFatal);
  }

  get basicsState() {
    return this.store.select(fromSelectBasics.selectState);
  }

  get assetState() {
    return this.store.select(fromSelectAsset.selectState);
  }

  get provisionableState() {
    return this.store.select(fromSelectProvisionable.selectState);
  }

  get loadedAndReady() {
    return this.store.select(fromSelectAsset.ready);
  }

  get incompleteModels() {
    return this.store.select(fromSelectBasics.selectIncompleteModels);
  }

  get itemsWithoutModel() {
    return this.store.select(fromSelectAsset.selectAssetsWithoutModel);
  }

  ngOnInit(): void {
  }

  retry() {
    this.store.dispatch(BasicsActions.resetRetryCount());
    this.store.dispatch(MetaDataActions.readState());
  }

}
