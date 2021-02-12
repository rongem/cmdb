import { Component, OnInit, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormArray, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AttributeType, MetaDataSelectors } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';

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
  @Input() selectedAttributeTypes: string[];
  @Input() allowedAttributeTypeList: AttributeType[];
  @Output() addAttributeType: EventEmitter<string> = new EventEmitter();
  @Output() changeAttributeValue: EventEmitter<{typeId: string, value: string}> = new EventEmitter();
  @Output() deleteAttributeType: EventEmitter<string> = new EventEmitter();
  disabled = false;

  propagateChange = (_: any) => {};
  propagateTouched = () => {};

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
  }

  onAddAttributeType(attributeTypeId: string) {
    this.addAttributeType.emit(attributeTypeId);
  }

  onChangeAttributeValue(typeId: string, value: string) {
    this.changeAttributeValue.emit({typeId, value});
  }

  onDeleteAttribute(typeId: string) {
    this.deleteAttributeType.emit(typeId);
  }

  writeValue(obj: any): void {
    if (obj !== undefined) {
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

  getAttributeType(attributeTypeId: string) {
    return this.store.select(MetaDataSelectors.selectSingleAttributeType, attributeTypeId);
  }

  get attributeTypesAvailable() {
    return this.allowedAttributeTypeList && this.allowedAttributeTypeList.length > 0;
  }

  get attributesPresent() {
    return (this.form.get('attributes') as FormArray).length !== 0;
  }

  get attributeControls() {
    return (this.form.get('attributes') as FormArray).controls;
  }
}
