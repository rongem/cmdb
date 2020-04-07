import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { tap, map } from 'rxjs/operators';
import { ItemType, FullConfigurationItem, Guid } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import * as fromSelectDisplay from 'projects/cmdb/src/app/display/store/display.selectors';
import * as fromSelectMetaData from 'projects/cmdb/src/app/shared/store/meta-data.selectors';
import * as DisplayActions from 'projects/cmdb/src/app/display/store/display.actions';

@Component({
  selector: 'app-result-table',
  templateUrl: './result-table.component.html',
  styleUrls: ['./result-table.component.scss']
})
export class ResultTableComponent implements OnInit {
  displayedColumnsMini = ['type', 'name'];
  displayedColumns = ['type', 'name', 'commands'];

  constructor(private router: Router,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
  }

  get resultState() {
    return this.store.pipe(
      select(fromSelectDisplay.getResultState),
      tap(state => {
        if (state.resultListFullLoading === false && state.resultListFullPresent === false) {
          this.router.navigate(['display', 'search']);
        }
      })
    );
  }

  get resultsItemTypes() {
    return this.store.select(fromSelectDisplay.selectItemTypesInResults);
  }

  get userRole() {
    return this.store.select(fromSelectMetaData.selectUserRole);
  }

  filterResultsByItemType(itemType: ItemType) {
    this.store.dispatch(DisplayActions.filterResultsByItemType({itemType}));
  }

  get resultColumns() {
    return this.store.select(fromSelectDisplay.selectResultListFullColumns);
  }

  get filteredResultColumns() {
    return this.resultColumns.pipe(map(values => values.filter(v => this.displayedColumns.indexOf(v.key) === -1)));
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

  onSelected() {}
}
