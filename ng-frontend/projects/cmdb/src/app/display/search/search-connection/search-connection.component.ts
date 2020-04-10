import { Component, OnInit, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup } from '@angular/forms';
import { Guid } from 'backend-access';

@Component({
  selector: 'app-search-connection',
  templateUrl: './search-connection.component.html',
  styleUrls: ['./search-connection.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchConnectionComponent),
      multi: true,
    }
  ]

})
export class SearchConnectionComponent implements OnInit, ControlValueAccessor {
  @Input() form: FormGroup;
  @Input() connectionTypeName: string;
  @Input() itemTypeName: string;
  @Output() deleteConnection = new EventEmitter();
  @Output() changeConnectionCount = new EventEmitter<string>();
  disabled = false;

  propagateChange = (_: any) => {};
  propagateTouched = () => {};

  constructor() { }

  ngOnInit() {
  }

  onDeleteConnection() {
    this.deleteConnection.emit();
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

  onChange(event: string) {
    this.changeConnectionCount.emit(event);
  }
}
