import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { FullConfigurationItem } from 'backend-access';
import { MultiEditSelectors } from '../../shared/store/store.api';

@Component({
  selector: 'app-multi-table',
  templateUrl: './multi-table.component.html',
  styleUrls: ['./multi-table.component.scss']
})
export class MultiTableComponent implements OnInit {
  @Input() items: FullConfigurationItem[];
  itemTable: MatTableDataSource<FullConfigurationItem>;
  displayedColumns = ['item'];

  constructor(private store: Store) { }

  get resultColumns() {
    return this.store.select(MultiEditSelectors.selectResultListFullColumns);
  }

  ngOnInit() {
    this.itemTable = new MatTableDataSource(this.items);
    this.resultColumns.pipe(take(1)).subscribe(columns => {
      columns.forEach(value => this.displayedColumns.push(value.key));
    });
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

}
