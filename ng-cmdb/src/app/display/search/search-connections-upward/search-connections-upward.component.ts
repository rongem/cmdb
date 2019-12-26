import { Component, OnInit, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormArray, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';

import { Guid } from 'src/app/shared/guid';
import { ConnectionType } from 'src/app/shared/objects/connection-type.model';
import { ItemType } from 'src/app/shared/objects/item-type.model';

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
  @Output() addConnection: EventEmitter<{connectionTypeId: Guid, itemTypeId?: Guid}> = new EventEmitter();
  @Output() changeConnection: EventEmitter<{index: number, count: string}> = new EventEmitter();
  @Output() deleteConnection: EventEmitter<number> = new EventEmitter();
  disabled = false;

  propagateChange = (_: any) => {};
  propagateTouched = () => {};

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
  }

  writeValue(obj: any): void {
    if (obj !== undefined && obj instanceof Guid) {
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
    return (this.form.get('ConnectionsToUpper') as FormArray).length !== 0;
  }

  get connectionsToUpperControls() {
      return (this.form.get('ConnectionsToUpper') as FormArray).controls as FormGroup[];
  }

  getItemTypesToUpperForCurrentItemType(connectionType: ConnectionType) {
    return this.store.select(fromSelectMetaData.selectUpperItemTypesForItemTypeAndConnectionType, {
      itemType: this.itemType,
      connectionType,
    });
  }

  getItemItype(itemTypeId: Guid) {
    return this.store.select(fromSelectMetaData.selectSingleItemType, itemTypeId);
  }

  getConnectionType(connTypeId: Guid) {
    return this.store.select(fromSelectMetaData.selectSingleConnectionType, connTypeId);
  }

  onAddConnectionToUpper(connectionTypeId: Guid, itemTypeId?: Guid) {
    this.addConnection.emit({connectionTypeId, itemTypeId});
  }

  onChangeConnectionCount(index: number, count: string) {
    this.changeConnection.emit({index, count});
  }

  onDeleteConnectionToUpper(index: number) {
    this.deleteConnection.emit(index);
  }
}
