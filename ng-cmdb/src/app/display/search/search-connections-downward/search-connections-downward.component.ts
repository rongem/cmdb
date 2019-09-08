import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormArray, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Guid } from 'src/app/shared/guid';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as DisplayActions from 'src/app/display/store/display.actions';
import * as fromDisplay from 'src/app/display/store/display.reducer';
import * as fromMetaData from 'src/app/shared/store/meta-data.reducer';

import { SearchService } from '../search.service';

@Component({
  selector: 'app-search-connections-downward',
  templateUrl: './search-connections-downward.component.html',
  styleUrls: ['./search-connections-downward.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchConnectionsDownwardComponent),
      multi: true,
    }
  ]
})
export class SearchConnectionsDownwardComponent implements OnInit, ControlValueAccessor {
  @Input() form: FormGroup;
  metaData: Observable<fromMetaData.State>;
  displayState: Observable<fromDisplay.State>;
  disabled = false;

  propagateChange = (_: any) => {};
  propagateTouched = () => {};

  constructor(private store: Store<fromApp.AppState>,
              public searchService: SearchService) { }

  ngOnInit() {
    this.metaData = this.store.select(fromApp.METADATA);
    this.displayState = this.store.select(fromApp.DISPLAY);
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
