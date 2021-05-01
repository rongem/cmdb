import { Component, OnInit, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-search-responsibility',
  templateUrl: './search-responsibility.component.html',
  styleUrls: ['./search-responsibility.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchResponsibilityComponent),
      multi: true,
    }
  ]

})
export class SearchResponsibilityComponent implements OnInit, ControlValueAccessor {
  @Input() userName: string;
  @Input() checked: boolean;
  @Output() changed = new EventEmitter<string>();
  disabled = false;

  constructor() { }

  propagateChange = (_: any) => {};
  propagateTouched = () => {};

  ngOnInit() {
  }

  onChange(event: MatSlideToggleChange) {
    if (event.checked) {
      this.changed.emit(this.userName);
      this.propagateChange(this.userName);
    } else {
      this.changed.emit('');
      this.propagateChange('');
    }
  }

  writeValue(obj: any): void {}

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
