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

  get connectionsToLowerPresent() {
    return (this.form.get('ConnectionsToLower') as FormArray).length !== 0;
  }

  get connectionsToLowerControls() {
      return (this.form.get('ConnectionsToLower') as FormArray).controls as FormGroup[];
  }

  get connectionTypesToLowerForCurrentItemType() {
    return this.store.pipe(select(fromSelectSearch.selectConnectionTypesForCurrentIsUpperSearchItemType));
  }

  getItemTypesToLowerForCurrentItemType(connType: ConnectionType) {
    return this.store.pipe(select(fromSelectSearch.selectLowerItemTypesForCurrentSearchItemTypeAndConnectionType, connType));
  }

  getItemItype(itemTypeId: Guid) {
    return this.store.pipe(select(fromSelectMetaData.selectSingleItemType, itemTypeId));
  }

  getConnectionType(connTypeId: Guid) {
    return this.store.pipe(select(fromSelectMetaData.selectSingleConnectionType, connTypeId));
  }

  onAddConnectionToLower(connectionTypeId: Guid, itemTypeId?: Guid) {
    this.store.dispatch(SearchActions.addConnectionTypeToLower({connectionTypeId, itemTypeId}));
  }

  onDeleteConnectionToLower(index: number) {
    this.store.dispatch(SearchActions.deleteConnectionTypeToLower({index}));
  }
}
