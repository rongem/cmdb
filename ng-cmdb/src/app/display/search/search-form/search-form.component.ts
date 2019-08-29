import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as DisplayActions from 'src/app/display/store/display.actions';
import * as fromDisplay from 'src/app/display/store/display.reducer';
import * as fromMetaData from 'src/app/shared/store/meta-data.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';

import { SearchContent } from '../search-content.model';
import { SearchService } from '../search.service';
import { ConnectionType } from 'src/app/shared/objects/connection-type.model';
import { ItemType } from 'src/app/shared/objects/item-type.model';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent implements OnInit {

  metaData: Observable<fromMetaData.State>;
  displayState: Observable<fromDisplay.State>;

  constructor(private store: Store<fromApp.AppState>,
              public searchService: SearchService) { }

  ngOnInit() {
    this.metaData = this.store.select(fromApp.METADATA);
    this.displayState = this.store.select(fromApp.DISPLAY);
  }

  onDeleteConnectionToUpper(index: number) {
    // this.store.dispatch(new SearchActions.DeleteConnectionTypeToUpper());
    this.searchService.deleteConnectionToUpper(index);
  }

  onDeleteConnectionToLower(index: number) {
    // this.store.dispatch(new SearchActions.DeleteConnectionTypeToLower());
    this.searchService.deleteConnectionToLower(index);
  }

  onAddResponsibility() {
    const sub = this.metaData.subscribe((value: fromMetaData.State) => {
      this.searchService.addResponsibility(value.userName);
      sub.unsubscribe();
    });
  }

  onResetForm() {
    this.searchService.searchContent = new SearchContent();
    this.searchService.initForm();
  }

  onSubmit() {
    console.log(this.searchService.searchForm.value);
    if (!this.searchService.searchForm.value.NameOrValue) {
      this.searchService.searchForm.value.NameOrValue = '';
    }
    if (!this.searchService.searchForm.value.ItemType) {
      this.searchService.searchForm.value.ItemType = '';
    }
    if (this.searchService.searchForm.value.NameOrValue === '' && this.searchService.searchForm.value.ItemType === '') {
      return;
    }
    console.log(this.searchService.searchForm.value);

    this.store.dispatch(new DisplayActions.PerformSearch(this.searchService.searchForm.value as SearchContent));
  }

  getItemItype(itemTypeId: Guid) {
    return this.store.pipe(select(fromSelectMetaData.selectSingleItemType, itemTypeId));
  }

  getConnectionType(connTypeId: Guid) {
    return this.store.pipe(select(fromSelectMetaData.selectSingleConnectionType, connTypeId));
  }

  getConnectionTypesToUpperForCurrentItemType() {
    return this.store.pipe(select(fromSelectMetaData.selectConnectionTypesForCurrentIsLowerItemType));
  }

  getConnectionTypesToLowerForCurrentItemType() {
    return this.store.pipe(select(fromSelectMetaData.selectConnectionTypesForCurrentIsUpperItemType));
  }

  getItemTypesToUpperForCurrentItemType(connType: ConnectionType) {
    return this.store.pipe(select(fromSelectMetaData.selectUpperItemTypesForCurrentItemTypeAndConnectionType, connType));
  }

  getItemTypesToLowerForCurrentItemType(connType: ConnectionType) {
    return this.store.pipe(select(fromSelectMetaData.selectLowerItemTypesForCurrentItemTypeAndConnectionType, connType));
  }

  log(val: any) {
    if (val instanceof Store) {
      val.pipe(take(1)).subscribe(v => console.log(v));
    }
    console.log(val);
    return val;
  }

}
