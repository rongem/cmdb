import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { switchMap, map } from 'rxjs/operators';
import { Guid, ItemType } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import * as fromSelectMetaData from 'projects/cmdb/src/app/shared/store/meta-data.selectors';
import * as fromSelectSearch from 'projects/cmdb/src/app/display/store/search.selectors';
import * as SearchActions from 'projects/cmdb/src/app/display/store/search.actions';


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
  disabled = false;

  propagateChange = (_: any) => {};
  propagateTouched = () => {};

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
  }

  onAddItemType(itemType: ItemType) {
    this.store.dispatch(SearchActions.addItemType({itemTypeId: itemType.TypeId}));
    this.propagateChange(itemType.TypeId);
  }

  onDeleteItemType() {
    this.store.dispatch(SearchActions.deleteItemType());
    this.propagateChange(undefined);
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

  get itemTypes() {
    return this.store.select(fromSelectMetaData.selectItemTypes);
  }

  get itemTypePresent() {
    return this.store.pipe(select(fromSelectSearch.selectSearchItemTypeId),
      map((typeId: Guid) => typeId ? true : false));
  }

  get selectedItemType() {
    return this.store.pipe(select(fromSelectSearch.selectSearchItemTypeId),
      switchMap((typeId: Guid) =>
        this.store.select(fromSelectMetaData.selectSingleItemType, typeId)));
  }
}
