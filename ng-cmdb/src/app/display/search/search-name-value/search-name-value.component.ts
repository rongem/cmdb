import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import * as SearchActions from 'src/app/display/store/search.actions';
import * as fromApp from 'src/app/shared/store/app.reducer';

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
  valueProposals: Observable<string[]>;
  disabled = false;

  propagateChange = (_: any) => {};
  propagateTouched = () => {};

  constructor(private store: Store<fromApp.AppState>,
              private http: HttpClient) { }

  ngOnInit() {
    this.valueProposals = new Observable<string[]>();
  }

  onTextChange(text: string) {
    this.valueProposals = this.getProposals(text);
    this.store.dispatch(SearchActions.addNameOrValue({text}));
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
