import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { LogSelectors } from 'backend-access';
import { tap } from 'rxjs/operators';

import * as fromApp from '../../../shared/store/app.reducer';

import { MultiEditService } from '../multi-edit.service';

@Component({
  selector: 'app-multi-results',
  templateUrl: './multi-results.component.html',
  styleUrls: ['./multi-results.component.scss']
})
export class MultiResultsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MultiResultsComponent>,
              private store: Store<fromApp.AppState>,
              private mes: MultiEditService,
              public dialog: MatDialog) { }

  ngOnInit() {
  }

  get logEntries() {
    return this.store.select(LogSelectors.selectLogEntries);
  }

  get operationsLeft() {
    return this.mes.operationsLeft();
  }

  get totalOperations() {
    return this.mes.connectionsToChange + this.mes.itemsToChange;
  }

}
