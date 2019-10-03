import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormArray, FormGroup } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as SearchActions from 'src/app/display/store/search.actions';
import * as fromDisplay from 'src/app/display/store/display.reducer';
import * as fromMetaData from 'src/app/shared/store/meta-data.reducer';
import * as fromSelectSearch from 'src/app/display/store/search.selectors';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';

import { Guid } from 'src/app/shared/guid';
import { ConnectionType } from 'src/app/shared/objects/connection-type.model';

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

  get connectionTypesToUpperForCurrentItemType() {
    return this.store.pipe(select(fromSelectSearch.selectConnectionTypesForCurrentIsLowerSearchItemType));
  }

  getItemTypesToUpperForCurrentItemType(connType: ConnectionType) {
    return this.store.pipe(select(fromSelectSearch.selectUpperItemTypesForCurrentSearchItemTypeAndConnectionType, connType));
  }

  getItemItype(itemTypeId: Guid) {
    console.log(itemTypeId);
    return this.store.pipe(select(fromSelectMetaData.selectSingleItemType, itemTypeId));
  }

  getConnectionType(connTypeId: Guid) {
    console.log(connTypeId);
    return this.store.pipe(select(fromSelectMetaData.selectSingleConnectionType, connTypeId));
  }

  onAddConnectionToUpper(connectionTypeId: Guid, itemTypeId?: Guid) {
    this.store.dispatch(SearchActions.addConnectionTypeToUpper({connectionTypeId, itemTypeId}));
  }

  onDeleteConnectionToUpper(index: number) {
    this.store.dispatch(SearchActions.deleteConnectionTypeToUpper({index}));
  }
}
