import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Guid } from 'src/app/shared/guid';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as DisplayActions from 'src/app/display/store/display.actions';
import * as SearchActions from 'src/app/display/store/search.actions';
import * as fromDisplay from 'src/app/display/store/display.reducer';
import * as fromMetaData from 'src/app/shared/store/meta-data.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromSelectSearch from 'src/app/display/store/search.selectors';

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
  forms$ = this.store.select(state => state.display.search.form);

  constructor(private store: Store<fromApp.AppState>,
              public searchService: SearchService) { }

  ngOnInit() {
    this.metaData = this.store.select(fromApp.METADATA);
    this.displayState = this.store.select(fromApp.DISPLAY);
  }

  onDeleteConnectionToUpper(index: number) {
    this.searchService.deleteConnectionToUpper(index);
  }

  onDeleteConnectionToLower(index: number) {
    this.searchService.deleteConnectionToLower(index);
  }

  onAddResponsibility() {
    const sub = this.metaData.subscribe((value: fromMetaData.State) => {
      this.searchService.addResponsibility(value.userName);
      sub.unsubscribe();
    });
  }

  onResetForm() {
    this.searchService.initForm();
  }

  onSubmit() {
    if (!this.searchService.searchForm.value.NameOrValue) {
      this.searchService.searchForm.value.NameOrValue = '';
    }
    if (this.searchService.searchForm.value.NameOrValue === '' && this.searchService.searchForm.value.ItemType === '') {
      return;
    }
    console.log(this.searchService.searchForm.value);

    this.store.dispatch(SearchActions.performSearch({searchContent: this.searchService.searchForm.value as SearchContent}));
  }

  getItemItype(itemTypeId: Guid) {
    return this.store.pipe(select(fromSelectMetaData.selectSingleItemType, itemTypeId));
  }

  get itemTypeBackColor() {
    return this.store.pipe(
      select(fromSelectSearch.selectSearchItemType),
      map(itemType => itemType ? itemType.TypeBackColor : 'inherit'),
    );
  }

  getConnectionType(connTypeId: Guid) {
    return this.store.pipe(select(fromSelectMetaData.selectSingleConnectionType, connTypeId));
  }

  get connectionTypesToUpperForCurrentItemType() {
    return this.store.pipe(select(fromSelectSearch.selectConnectionTypesForCurrentIsLowerSearchItemType));
  }

  get connectionTypesToLowerForCurrentItemType() {
    return this.store.pipe(select(fromSelectSearch.selectConnectionTypesForCurrentIsUpperSearchItemType));
  }

  getItemTypesToUpperForCurrentItemType(connType: ConnectionType) {
    return this.store.pipe(select(fromSelectSearch.selectUpperItemTypesForCurrentSearchItemTypeAndConnectionType, connType));
  }

  getItemTypesToLowerForCurrentItemType(connType: ConnectionType) {
    return this.store.pipe(select(fromSelectSearch.selectLowerItemTypesForCurrentSearchItemTypeAndConnectionType, connType));
  }
}
