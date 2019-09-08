import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormArray, FormGroup } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Guid } from 'src/app/shared/guid';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as DisplayActions from 'src/app/display/store/display.actions';
import * as fromDisplay from 'src/app/display/store/display.reducer';
import * as fromMetaData from 'src/app/shared/store/meta-data.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';

import { SearchService } from '../search.service';
import { AttributeType } from 'src/app/shared/objects/attribute-type.model';

@Component({
  selector: 'app-search-attributes',
  templateUrl: './search-attributes.component.html',
  styleUrls: ['./search-attributes.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchAttributesComponent),
      multi: true,
    }
  ]
})
export class SearchAttributesComponent implements OnInit, ControlValueAccessor {
  @Input() form: FormGroup;
  metaData: Observable<fromMetaData.State>;
  displayState: Observable<fromDisplay.State>;
  disabled = false;

  propagateChange = (_: any) => {};
  propagateTouched = () => {};

  constructor(private store: Store<fromApp.AppState>,
              public searchService: SearchService) { }

  ngOnInit() {
    this.metaData = this.store.select(fromApp.METADATA);
    this.displayState = this.store.select(fromApp.DISPLAY);
  }

  onAddAttributeType(attributeTypeId: Guid) {
    // this.store.dispatch(new SearchActions.AddAttributeType(attributeTypeId)));
    this.searchService.addAttributeType(attributeTypeId);
  }

  onDeleteAttribute(attributeTypeId: Guid) {
    // this.store.dispatch(new SearchActions.DeleteAttributeType());
    this.searchService.deleteAttributeType(attributeTypeId);
  }

  writeValue(obj: any): void {
    if (obj !== undefined && obj instanceof Guid) {
      this.onAddAttributeType(obj);
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

  getAttributeType(guid: Guid) {
    return this.store.pipe(select(fromSelectMetaData.selectSingleAttributeType, guid));
  }

  getSelectedAttributeTypes() {
    return this.store.pipe(select(fromSelectDisplay.selectSearchUsedAttributeTypes));
  }

  getAllowedAttributeTypeList() {
    return this.store.pipe(select(fromSelectDisplay.selectSearchAvailableAttributeTypes));
  }
}
