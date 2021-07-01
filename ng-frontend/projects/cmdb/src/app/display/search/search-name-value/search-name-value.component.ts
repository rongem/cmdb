import { Component, OnInit, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';

import { ReadFunctions } from 'backend-access';

@Component({
  selector: 'app-search-name-value',
  templateUrl: './search-name-value.component.html',
  styleUrls: ['./search-name-value.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchNameValueComponent),
      multi: true,
    }
  ]
})
export class SearchNameValueComponent implements OnInit, ControlValueAccessor {
  @Input() textValue: string;
  @Output() changeText = new EventEmitter<string>();
  valueProposals: Observable<string[]>;
  disabled = false;

  constructor(private http: HttpClient) { }

  propagateChange = (_: any) => {};
  propagateTouched = () => {};

  ngOnInit() {
    this.valueProposals = new Observable<string[]>();
  }

  onTextChange(control: EventTarget) {
    console.log(control);
    // this.valueProposals = this.getProposals(control.value);
    // this.propagateChange(control.value);
    // this.changeText.emit(control.value);
  }

  writeValue(obj: any): void {
    if (typeof obj === 'string' || !obj) {
      this.textValue = obj;
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

  getProposals(text: string) {
    if (text === undefined || text.length < 2) {
        return new Observable<string[]>();
    }
    return ReadFunctions.proposal(this.http, text);
  }
}
