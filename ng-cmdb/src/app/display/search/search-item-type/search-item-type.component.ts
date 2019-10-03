import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as SearchActions from 'src/app/display/store/search.actions';
import * as fromDisplay from 'src/app/display/store/display.reducer';
import * as fromMetaData from 'src/app/shared/store/meta-data.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromSelectSearch from 'src/app/display/store/search.selectors';

import { ItemType } from 'src/app/shared/objects/item-type.model';
import { switchMap, map } from 'rxjs/operators';
import { Guid } from 'src/app/shared/guid';

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
  displayState: Observable<fromDisplay.State>;
  disabled = false;

  propagateChange = (_: any) => {};
  propagateTouched = () => {};

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.metaData = this.store.select(fromApp.METADATA);
    this.displayState = this.store.select(fromApp.DISPLAY);
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

  get itemTypePresent() {
    return this.store.pipe(select(fromSelectSearch.selectSearchItemTypeId),
      map((typeId: Guid) => typeId ? true : false));
  }

  get selectedItemType() {
    return this.store.pipe(select(fromSelectSearch.selectSearchItemTypeId),
      switchMap((typeId: Guid) =>
        this.store.pipe(select(fromSelectMetaData.selectSingleItemType, typeId))));
  }
}
