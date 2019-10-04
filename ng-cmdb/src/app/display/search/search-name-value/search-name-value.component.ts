import { Component, OnInit, Input, forwardRef, Output, EventEmitter, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';

import { getUrl } from 'src/app/shared/store/functions';

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

  propagateChange = (_: any) => {};
  propagateTouched = () => {};

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.valueProposals = new Observable<string[]>();
  }

  onTextChange(text: string) {
    this.valueProposals = this.getProposals(text);
    this.propagateChange(text);
    this.changeText.emit(text);
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
    return this.http.get<string[]>(getUrl('Proposals/' + text));
  }
}
