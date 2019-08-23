import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';

import { SearchService } from '../search.service';

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
  @Input() textValue;
  valueProposals: Observable<string[]>;

  propagateChange = (_: any) => {};

  constructor(public searchService: SearchService) { }

  ngOnInit() {
    this.valueProposals = new Observable<string[]>();
  }

  onTextChange(text: string) {
    this.valueProposals = this.searchService.getProposals(text);
    this.propagateChange(text);
  }

  writeValue(obj: any): void {
    if (typeof obj === 'string') {
      this.textValue = obj;
    }
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}
}
