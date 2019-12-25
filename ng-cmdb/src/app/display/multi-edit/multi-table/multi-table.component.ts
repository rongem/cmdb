import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Store, select } from '@ngrx/store';


import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';
import * as fromSelectMultiEdit from 'src/app/display/store/multi-edit.selectors';

import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { Guid } from 'src/app/shared/guid';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-multi-table',
  templateUrl: './multi-table.component.html',
  styleUrls: ['./multi-table.component.scss']
})
export class MultiTableComponent implements OnInit {
  @Input() items: FullConfigurationItem[];
  itemTable: MatTableDataSource<FullConfigurationItem>;
  displayedColumns = ['item'];

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.itemTable = new MatTableDataSource(this.items);
    this.resultColumns.pipe(take(1)).subscribe(columns => {
      columns.forEach(value => this.displayedColumns.push(value.key));
    });
  }

  get resultColumns() {
    return this.store.select(fromSelectMultiEdit.selectResultListFullColumns);
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
