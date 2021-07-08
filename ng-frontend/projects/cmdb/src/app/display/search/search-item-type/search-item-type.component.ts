import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Store } from '@ngrx/store';
import { switchMap, map } from 'rxjs/operators';
import { ItemType, MetaDataSelectors } from 'backend-access';

import * as fromSelectSearchForm from '../../store/search-form.selectors';
import * as SearchActions from '../../store/search-form.actions';


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

  constructor(private store: Store) { }

  propagateChange = (_: any) => {};
  propagateTouched = () => {};

  ngOnInit() {
  }

  onAddItemType(itemType: ItemType) {
    this.store.dispatch(SearchActions.addItemType({typeId: itemType.id}));
    this.propagateChange(itemType.id);
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
    return this.store.select(MetaDataSelectors.selectItemTypes);
  }

  get itemTypePresent() {
    return this.store.select(fromSelectSearchForm.selectSearchItemTypeId).pipe(
      map(typeId => typeId ? true : false)
    );
  }

  get selectedItemType() {
    return this.store.select(fromSelectSearchForm.selectSearchItemTypeId).pipe(
      switchMap(typeId => this.store.select(MetaDataSelectors.selectSingleItemType(typeId)))
    );
  }
}
