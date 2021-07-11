import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { FullConfigurationItem, MetaDataSelectors } from 'backend-access';
import  { ItemSelectors, NeighborSearchSelectors } from '../../../shared/store/store.api';

@Component({
  selector: 'app-result-table-neighbor',
  templateUrl: './result-table-neighbor.component.html',
  styleUrls: ['./result-table-neighbor.component.scss']
})
export class ResultTableNeighborComponent implements OnInit, OnDestroy {
  displayedColumns = ['type', 'name', 'commands'];
  private subscription: Subscription;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private store: Store) { }

  ngOnInit() {
    this.subscription = this.store.select(NeighborSearchSelectors.form).pipe(
      withLatestFrom(this.route.params, this.store.select(NeighborSearchSelectors.resultListFailed)),
    ).subscribe(([form, params, failed]) => {
      if (form.sourceItem !== params.id) {
        this.router.navigate(['display', 'configuration-item', params.id]);
      }
      if (failed) {
        this.router.navigate(['display', 'configuration-item', params.id, 'search']);
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  get resultList() {
    return this.store.select(NeighborSearchSelectors.resultList);
  }

  get items() {
    return this.store.select(NeighborSearchSelectors.resultList).pipe(
      withLatestFrom(this.store.select(NeighborSearchSelectors.resultListPresent)),
      map(([list, present]) => present ? list.map(result => result.fullItem) : [])
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
