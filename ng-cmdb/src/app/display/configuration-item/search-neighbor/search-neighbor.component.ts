import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';
import * as SearchActions from 'src/app/display/store/search.actions';


@Component({
  selector: 'app-search-neighbor',
  templateUrl: './search-neighbor.component.html',
  styleUrls: ['./search-neighbor.component.scss']
})
export class SearchNeighborComponent implements OnInit {

  constructor(private store: Store<fromApp.AppState>,
              private fb: FormBuilder) { }

  ngOnInit() {
  }

  get itemReady() {
    return this.store.pipe(
      select(fromSelectDisplay.getItemState),
      map(value => value.itemReady),
    );
  }

  get configurationItem() {
    return this.store.pipe(select(fromSelectDisplay.selectDisplayConfigurationItem));
  }

}
