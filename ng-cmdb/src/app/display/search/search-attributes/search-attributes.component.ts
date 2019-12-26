import { Component, OnInit, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormArray, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';

import { Guid } from 'src/app/shared/guid';
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
  @Input() selectedAttributeTypes: Guid[];
  @Input() allowedAttributeTypeList: AttributeType[];
  @Output() addAttributeType: EventEmitter<Guid> = new EventEmitter();
  @Output() changeAttributeValue: EventEmitter<{AttributeTypeId: Guid, AttributeValue: string}> = new EventEmitter();
  @Output() deleteAttributeType: EventEmitter<Guid> = new EventEmitter();
  disabled = false;

  propagateChange = (_: any) => {};
  propagateTouched = () => {};

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
  }

  onAddAttributeType(attributeTypeId: Guid) {
    this.addAttributeType.emit(attributeTypeId);
  }

  onChangeAttributeValue(attributeTypeId: Guid, attributeValue: string) {
    this.changeAttributeValue.emit({AttributeTypeId: attributeTypeId, AttributeValue: attributeValue});
  }

  onDeleteAttribute(attributeTypeId: Guid) {
    this.deleteAttributeType.emit(attributeTypeId);
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
    return this.store.select(fromSelectMetaData.selectSingleAttributeType, guid);
  }

  get attributeTypesAvailable() {
    return this.allowedAttributeTypeList && this.allowedAttributeTypeList.length > 0;
  }

  get attributesPresent() {
    return (this.form.get('Attributes') as FormArray).length !== 0;
  }

  get attributeControls() {
      return (this.form.get('Attributes') as FormArray).controls;
  }
}
