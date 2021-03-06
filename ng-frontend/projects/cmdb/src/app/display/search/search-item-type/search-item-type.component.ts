import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { switchMap, map } from 'rxjs/operators';
import { ItemType, MetaDataSelectors } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import * as fromSelectSearchForm from 'projects/cmdb/src/app/display/store/search-form.selectors';
import * as SearchActions from 'projects/cmdb/src/app/display/store/search-form.actions';


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
    return this.store.pipe(select(fromSelectSearchForm.selectSearchItemTypeId),
      map(typeId => typeId ? true : false));
  }

  get selectedItemType() {
    return this.store.pipe(select(fromSelectSearchForm.selectSearchItemTypeId),
      switchMap(typeId => this.store.select(MetaDataSelectors.selectSingleItemType, typeId)));
  }
}
