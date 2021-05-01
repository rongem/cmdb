import { Component, OnInit, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormArray, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ConnectionType, ItemType, MetaDataSelectors } from 'backend-access';

import * as fromApp from '../../../shared/store/app.reducer';


@Component({
  selector: 'app-search-connections-upward',
  templateUrl: './search-connections-upward.component.html',
  styleUrls: ['./search-connections-upward.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchConnectionsUpwardComponent),
      multi: true,
    }
  ]

})
export class SearchConnectionsUpwardComponent implements OnInit, ControlValueAccessor {
  @Input() form: FormGroup;
  @Input() itemType: ItemType;
  @Input() connectionTypes: ConnectionType[];
  @Output() addConnection: EventEmitter<{connectionTypeId: string; itemTypeId?: string}> = new EventEmitter();
  @Output() changeConnection: EventEmitter<{index: number; count: string}> = new EventEmitter();
  @Output() deleteConnection: EventEmitter<number> = new EventEmitter();
  disabled = false;

  constructor(private store: Store<fromApp.AppState>) { }

  propagateChange = (_: any) => {};
  propagateTouched = () => {};

  ngOnInit() {
  }

  writeValue(obj: any): void {
    if (obj !== undefined) {
      // this.onAddAttributeType(obj);
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

  get connectionsToUpperPresent() {
    return this.connectionsToUpperControls.length !== 0;
  }

  get connectionsToUpperControls() {
    return (this.form.get('connectionsToUpper') as FormArray).controls as FormGroup[];
  }

  getItemTypesToUpperForCurrentItemType(connectionType: ConnectionType) {
    return this.store.select(MetaDataSelectors.selectUpperItemTypesForItemTypeAndConnectionType, {
      itemType: this.itemType,
      connectionType,
    });
  }

  getItemItype(itemTypeId: string) {
    return this.store.select(MetaDataSelectors.selectSingleItemType, itemTypeId);
  }

  getConnectionType(connTypeId: string) {
    return this.store.select(MetaDataSelectors.selectSingleConnectionType, connTypeId);
  }

  onAddConnectionToUpper(connectionTypeId: string, itemTypeId?: string) {
    this.addConnection.emit({connectionTypeId, itemTypeId});
  }

  onChangeConnectionCount(index: number, count: string) {
    this.changeConnection.emit({index, count});
  }

  onDeleteConnectionToUpper(index: number) {
    this.deleteConnection.emit(index);
  }
}
