import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { tap, map } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as DisplayActions from 'src/app/display/store/display.actions';

import { ItemType } from 'src/app/shared/objects/item-type.model';
import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { Guid } from 'src/app/shared/guid';

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
    return this.store.pipe(select(fromSelectDisplay.selectItemTypesInResults));
  }

  get userRole() {
    return this.store.pipe(select(fromSelectMetaData.selectUserRole));
  }

  filterResultsByItemType(itemType: ItemType) {
    this.store.dispatch(DisplayActions.filterResultsByItemType({itemType}));
  }

  get resultColumns() {
    return this.store.pipe(select(fromSelectDisplay.selectResultListFullColumns));
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
