import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormArray, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Guid } from 'guid-typescript';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as SearchActions from '../store/search.actions';
import * as fromSearch from '../store/search.reducer';
import * as fromMetaData from 'src/app/shared/store/meta-data.reducer';

import { SearchService } from '../search.service';

@Component({
  selector: 'app-search-connections-upward',
  templateUrl: './search-connections-upward.component.html',
  styleUrls: ['./search-connections-upward.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchConnectionsUpwardComponent),
      multi: true,
    }
  ]

})
export class SearchConnectionsUpwardComponent implements OnInit, ControlValueAccessor {
  @Input() form: FormGroup;
  metaData: Observable<fromMetaData.State>;
  search: Observable<fromSearch.State>;
  disabled = false;

  propagateChange = (_: any) => {};
  propagateTouched = () => {};

  constructor(private store: Store<fromApp.AppState>,
              public searchService: SearchService) { }

  ngOnInit() {
    this.metaData = this.store.select(fromApp.METADATA);
    this.search = this.store.select(fromApp.SEARCH);
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
}
