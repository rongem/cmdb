import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';
import * as SearchActions from 'src/app/display/store/search.actions';

import { Guid } from 'src/app/shared/guid';

@Component({
  selector: 'app-search-neighbor',
  templateUrl: './search-neighbor.component.html',
  styleUrls: ['./search-neighbor.component.scss']
})
export class SearchNeighborComponent implements OnInit {
  form: FormGroup;

  constructor(private store: Store<fromApp.AppState>,
              private fb: FormBuilder,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.form = this.fb.group({
        ItemType: Guid.EMPTY,
        SourceItem: params.id,
        MaxLevels: 5,
        ExtraSearch: this.fb.group({
          NameOrValue: '',
          ItemType: undefined,
          Attributes: this.fb.array([]),
          ConnectionsToUpper: this.fb.array([]),
          ConnectionsToLower: this.fb.array([]),
          ResponsibleToken: '',
        }),
      });
    });
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
