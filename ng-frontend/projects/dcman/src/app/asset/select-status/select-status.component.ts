import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-select-status',
  templateUrl: './select-status.component.html',
  styleUrls: ['./select-status.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectStatusComponent),
      multi: true,
    }
  ]
})

export class SelectStatusComponent implements OnInit, ControlValueAccessor {
  disabled = false;

  constructor() { }

  ngOnInit(): void {
  }

  propagateChange = (_: any) => {};
  propagateTouched = () => {};


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

}
