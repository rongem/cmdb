import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectNeighbor from 'src/app/display/store/neighbor.selectors';

import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { Guid } from 'src/app/shared/guid';
import { getRouterState } from 'src/app/shared/store/router/router.reducer';

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
        if (state.form.SourceItem !== params.id) {
          this.router.navigate(['display', 'configuration-item', params.id]);
        }
        if (state.resultListFullLoading === false && state.resultListFullPresent === false) {
          this.router.navigate(['display', 'configuration-item', params.id, 'search']);
        }
        return state;
      })
    );
  }

  get resultColumns() {
    return this.store.pipe(select(fromSelectNeighbor.selectResultListFullColumns));
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
}
