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

  onAddAttributeType(attributeTypeId: Guid) {
    // this.store.dispatch(new SearchActions.AddAttributeType(attributeTypeId)));
    this.searchService.addAttributeType(attributeTypeId);
  }

  onDeleteAttribute(index: number) {
    // this.store.dispatch(new SearchActions.DeleteAttributeType());
    this.searchService.deleteAttributeType(index);
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
}
