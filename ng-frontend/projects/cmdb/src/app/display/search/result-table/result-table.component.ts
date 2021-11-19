import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { ItemType, FullConfigurationItem, MetaDataSelectors } from 'backend-access';

import { ItemActions, ItemSelectors } from '../../../shared/store/store.api';

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
              private store: Store) { }

  get resultListPresent() {
    return this.store.select(ItemSelectors.resultListPresent);
  }

  get resultList() {
    return this.store.select(ItemSelectors.resultList);
  }

  get resultsItemTypes() {
    return this.store.select(ItemSelectors.itemTypesInResults);
  }

  get userRole() {
    return this.store.select(MetaDataSelectors.selectUserRole);
  }

  get resultColumns() {
    return this.store.select(ItemSelectors.resultListFullColumns);
  }

  get filteredResultColumns() {
    return this.resultColumns.pipe(map(values => values.filter(v => this.displayedColumns.indexOf(v.key) === -1)));
  }

  ngOnInit() {
    this.subscription = this.store.select(ItemSelectors.resultListFailed).subscribe(failed => {
      if (failed) {
        this.router.navigate(['display', 'search']);
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  addResultColumn(col: string) {
    this.displayedColumns.splice(-1, 0, col);
  }

  deleteResultColumn(col: string) {
    this.displayedColumns = this.displayedColumns.filter(c => c !== col);
  }

  filterResultsByItemType(itemType: ItemType) {
    this.store.dispatch(ItemActions.filterResultsByItemType({itemType}));
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
