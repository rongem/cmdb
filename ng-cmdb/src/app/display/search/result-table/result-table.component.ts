import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromDisplay from 'src/app/display/store/display.reducer';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';
import * as DisplayActions from 'src/app/display/store/display.actions';
import * as fromMetaData from 'src/app/shared/store/meta-data.reducer';
import { ItemType } from 'src/app/shared/objects/item-type.model';
import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { Guid } from 'src/app/shared/guid';

@Component({
  selector: 'app-result-table',
  templateUrl: './result-table.component.html',
  styleUrls: ['./result-table.component.scss']
})
export class ResultTableComponent implements OnInit {
  displayStore: Observable<fromDisplay.State>;
  meta: Observable<fromMetaData.State>;
  displayedColumnsMini = ['type', 'name'];
  displayedColumns = ['type', 'name', 'commands'];

  constructor(private router: Router,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.meta = this.store.select(fromApp.METADATA);
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

  getFilteredResultsColumns() {
    return this.getResultsColumns().pipe(map(values => values.filter(v => this.displayedColumns.indexOf(v.key) === -1)));
  }

  addResultColumn(col: string) {
    this.displayedColumns.splice(-1, 0, col);
  }

  deleteResultColumn(col: string) {
    this.displayedColumns = this.displayedColumns.filter(c => c !== col);
  }

  getValue(ci: FullConfigurationItem, attributeTypeId: Guid) {
    const att = ci.attributes.find(a => a.typeId === attributeTypeId);
    return att ? att.value : '-';
  }

  getConnections(ci: FullConfigurationItem, prop: string) {
    const val = prop.split(':');
    switch (val[0]) {
      case 'ctl':
        return ci.connectionsToLower.filter(c => c.ruleId.toString() === val[1]);
      case 'ctu':
        return ci.connectionsToUpper.filter(c => c.ruleId.toString() === val[1]);
      default:
        return [];
    }
  }
}
