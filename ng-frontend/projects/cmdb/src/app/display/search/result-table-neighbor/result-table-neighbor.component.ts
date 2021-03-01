import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';
import { FullConfigurationItem, MetaDataSelectors } from 'backend-access';

import * as fromApp from '../../../shared/store/app.reducer';
import * as fromSelectNeighbor from '../../store/neighbor.selectors';
import * as fromSelectDisplay from '../../store/display.selectors';

@Component({
  selector: 'app-result-table-neighbor',
  templateUrl: './result-table-neighbor.component.html',
  styleUrls: ['./result-table-neighbor.component.scss']
})
export class ResultTableNeighborComponent implements OnInit {
  displayedColumns = ['type', 'name', 'commands'];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
  }

  get state() {
    return this.store.pipe(
      select(fromSelectNeighbor.getState),
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
    return this.store.pipe(
      select(fromSelectNeighbor.getState),
      map(state => state.resultListFullPresent ?
        state.resultList.map(result => result.fullItem) : [])
    );
  }

  get originItem() {
    return this.store.select(fromSelectDisplay.selectDisplayConfigurationItem);
  }

  get resultColumns() {
    return this.store.select(fromSelectNeighbor.selectResultListFullColumns);
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
