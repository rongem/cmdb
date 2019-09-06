import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromDisplay from 'src/app/display/store/display.reducer';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';
import * as DisplayActions from 'src/app/display/store/display.actions';
import { ItemType } from 'src/app/shared/objects/item-type.model';

@Component({
  selector: 'app-result-table',
  templateUrl: './result-table.component.html',
  styleUrls: ['./result-table.component.scss']
})
export class ResultTableComponent implements OnInit {
  displayStore: Observable<fromDisplay.State>;
  displayedColumnsMini = ['type', 'name'];
  displayedColumns = ['type', 'name', 'commands'];

  constructor(private router: Router,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.displayStore = this.store.select(fromApp.DISPLAY).pipe(
      tap(state => {
        if (state.result.resultListFullLoading === false && state.result.resultListFullPresent === false) {
          this.router.navigate(['display', 'search']);
        }
      })
    );
  }

  getResultsItemTypes() {
    return this.store.pipe(select(fromSelectDisplay.selectItemTypesInResults));
  }

  filterResultsByItemType(itemType: ItemType) {
    this.store.dispatch(DisplayActions.filterResultsByItemType({itemType}));
  }

  getResultsColumns() {
    return this.store.pipe(select(fromSelectDisplay.selectResultListFullColumns));
  }

}
