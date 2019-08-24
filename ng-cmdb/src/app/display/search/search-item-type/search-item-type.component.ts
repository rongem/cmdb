import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as SearchActions from '../store/search.actions';
import * as fromSearch from '../store/search.reducer';
import * as fromMetaData from 'src/app/shared/store/meta-data.reducer';

import { SearchService } from '../search.service';
import { ItemType } from 'src/app/shared/objects/item-type.model';

@Component({
  selector: 'app-search-item-type',
  templateUrl: './search-item-type.component.html',
  styleUrls: ['./search-item-type.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchItemTypeComponent),
      multi: true,
    }
  ]
})
export class SearchItemTypeComponent implements OnInit, ControlValueAccessor {
  metaData: Observable<fromMetaData.State>;
  search: Observable<fromSearch.State>;
  disabled = false;

  propagateChange = (_: any) => {};
  propagateTouched = () => {};

  constructor(private store: Store<fromApp.AppState>,
              public searchService: SearchService) { }

  ngOnInit() {
    this.metaData = this.store.select(fromApp.METADATA);
    this.search = this.store.select(fromApp.SEARCH);
  }

  onAddItemType(itemType: ItemType) {
    this.store.dispatch(new SearchActions.AddItemType(itemType));
    this.searchService.addItemType(itemType);
    this.propagateChange(itemType.TypeId);
  }

  onDeleteItemType() {
    this.store.dispatch(new SearchActions.DeleteItemType());
    this.searchService.deleteItemType();
    this.propagateChange(null);
  }

  writeValue(obj: any): void {
    if (obj !== undefined && obj instanceof ItemType) {
      this.onAddItemType(obj);
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
