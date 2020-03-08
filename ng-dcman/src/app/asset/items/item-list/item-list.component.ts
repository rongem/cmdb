import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromSelectBasics from 'src/app/shared/store/basics/basics.selectors';
import * as fromSelectAsset from 'src/app/shared/store/asset/asset.selectors';
import * as MetaDataActions from 'src/app/shared/store/meta-data.actions';

import { AppState } from 'src/app/shared/store/app.reducer';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
  }

  get itemList() {
    return this.store.select(fromSelectAsset.selectAllItems);
  }

}
