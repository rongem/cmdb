import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { tap, map } from 'rxjs/operators';
import { ItemType, FullConfigurationItem, MetaDataSelectors } from 'backend-access';

import * as fromApp from '../../../shared/store/app.reducer';
import * as fromSelectDisplay from '../../store/display.selectors';
import * as DisplayActions from '../../store/display.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-result-table',
  templateUrl: './result-table.component.html',
  styleUrls: ['./result-table.component.scss']
})
export class ResultTableComponent implements OnInit, OnDestroy {
  displayedColumnsMini = ['type', 'name'];
  displayedColumns = ['type', 'name', 'commands'];
  private subscription: Subscription;

  constructor(private router: Router,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.subscription = this.store.select(fromSelectDisplay.getResultState).subscribe(state => {
      if (state.resultListLoading === false && state.resultListPresent === false) {
        this.router.navigate(['display', 'search']);
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  get resultListPresent() {
    return this.store.select(fromSelectDisplay.selectResultListPresent);
  }

  get resultList() {
    return this.store.select(fromSelectDisplay.selectResultList);
  }

  get resultsItemTypes() {
    return this.store.select(fromSelectDisplay.selectItemTypesInResults);
  }

  get userRole() {
    return this.store.select(MetaDataSelectors.selectUserRole);
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

  getValue(ci: FullConfigurationItem, attributeTypeId: string) {
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
