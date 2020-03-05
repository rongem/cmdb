import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromSelectBasics from 'src/app/shared/store/basics/basics.selectors';
import * as fromSelectAsset from 'src/app/shared/store/asset/asset.selectors';
import * as MetaDataActions from 'src/app/shared/store/meta-data.actions';
import { AppState } from 'src/app/shared/store/app.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
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

  retry() {
    this.store.dispatch(MetaDataActions.readState({resetRetryCount: true}));
  }

}
