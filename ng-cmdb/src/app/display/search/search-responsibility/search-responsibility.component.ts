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
export class SearchResponsibilityComponent implements OnInit {
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

}
