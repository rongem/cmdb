import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';
import { FullConfigurationItem, MetaDataSelectors } from 'backend-access';

import  { ItemSelectors, NeighborSearchSelectors } from '../../../shared/store/store.api';

@Component({
  selector: 'app-result-table-neighbor',
  templateUrl: './result-table-neighbor.component.html',
  styleUrls: ['./result-table-neighbor.component.scss']
})
export class ResultTableNeighborComponent implements OnInit {
  displayedColumns = ['type', 'name', 'commands'];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private store: Store) { }

  ngOnInit() {
  }

  get state() {
    return this.store.select(NeighborSearchSelectors.getState).pipe(
      withLatestFrom(this.route.params),
      map(([state, params]) => {
        if (state.form.sourceItem !== params.id) {
          this.router.navigate(['display', 'configuration-item', params.id]);
        }
        if (state.resultListFullLoading === false && state.resultListFullPresent === false) {
          this.router.navigate(['display', 'configuration-item', params.id, 'search']);
        }
        return state;
      })
    );
  }

  get items() {
    return this.store.select(NeighborSearchSelectors.getState).pipe(
      map(state => state.resultListFullPresent ?
        state.resultList.map(result => result.fullItem) : [])
    );
  }

  get originItem() {
    return this.store.select(ItemSelectors.configurationItem);
  }

  get resultColumns() {
    return this.store.select(NeighborSearchSelectors.selectResultListFullColumns);
  }

  get filteredResultColumns() {
    return this.resultColumns.pipe(map(values => values.filter(v => this.displayedColumns.indexOf(v.key) === -1)));
  }

  get userRole() {
    return this.store.select(MetaDataSelectors.selectUserRole);
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
