import { Component, OnInit, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormArray, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ConnectionType, ItemType, MetaDataSelectors } from 'backend-access';

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
  @Output() addConnection: EventEmitter<{connectionTypeId: string; itemTypeId?: string; count: string}> = new EventEmitter();
  @Output() changeConnection: EventEmitter<{index: number; count: string}> = new EventEmitter();
  @Output() deleteConnection: EventEmitter<number> = new EventEmitter();
  disabled = false;

  constructor(private store: Store) { }

  get connectionsToLowerPresent() {
    return this.connectionsToLowerControls.length !== 0;
  }

  get connectionsToLowerControls() {
    return (this.form.get('connectionsToLower') as FormArray).controls as FormGroup[];
  }

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

  getItemTypesToLowerForCurrentItemType(connectionType: ConnectionType) {
    return this.store.select(MetaDataSelectors.selectLowerItemTypesForItemTypeAndConnectionType(this.itemType, connectionType));
  }

  getItemItype(itemTypeId: string) {
    return this.store.select(MetaDataSelectors.selectSingleItemType(itemTypeId));
  }

  getConnectionType(connTypeId: string) {
    return this.store.select(MetaDataSelectors.selectSingleConnectionType(connTypeId));
  }

  onAddConnectionToLower(connectionTypeId: string, itemTypeId?: string) {
    this.addConnection.emit({connectionTypeId, itemTypeId, count: '1'});
  }

  onChangeConnectionCount(index: number, count: string) {
    this.changeConnection.emit({index, count});
  }

  onDeleteConnectionToLower(index: number) {
    this.deleteConnection.emit(index);
  }
}
