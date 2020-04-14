import { Component, OnInit, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormArray, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Guid, ConnectionType, ItemType, MetaDataSelectors } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';

@Component({
  selector: 'app-search-connections-downward',
  templateUrl: './search-connections-downward.component.html',
  styleUrls: ['./search-connections-downward.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchConnectionsDownwardComponent),
      multi: true,
    }
  ]
})
export class SearchConnectionsDownwardComponent implements OnInit, ControlValueAccessor {
  @Input() form: FormGroup;
  @Input() itemType: ItemType;
  @Input() connectionTypes: ConnectionType[];
  @Output() addConnection: EventEmitter<{connectionTypeId: string, itemTypeId?: string}> = new EventEmitter();
  @Output() changeConnection: EventEmitter<{index: number, count: string}> = new EventEmitter();
  @Output() deleteConnection: EventEmitter<number> = new EventEmitter();
  disabled = false;

  propagateChange = (_: any) => {};
  propagateTouched = () => {};

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
  }

  writeValue(obj: any): void {
    if (obj !== undefined && Guid.isGuid(obj)) {
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

  get connectionsToLowerPresent() {
    return this.connectionsToLowerControls.length !== 0;
  }

  get connectionsToLowerControls() {
    return (this.form.get('connectionsToLower') as FormArray).controls as FormGroup[];
  }

  getItemTypesToLowerForCurrentItemType(connectionType: ConnectionType) {
    return this.store.select(MetaDataSelectors.selectLowerItemTypesForItemTypeAndConnectionType, {
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

  onAddConnectionToLower(connectionTypeId: string, itemTypeId?: string) {
    this.addConnection.emit({connectionTypeId, itemTypeId});
  }

  onChangeConnectionCount(index: number, count: string) {
    this.changeConnection.emit({index, count});
  }

  onDeleteConnectionToLower(index: number) {
    this.deleteConnection.emit(index);
  }
}
