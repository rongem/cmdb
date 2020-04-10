import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { LogSelectors } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';

@Component({
  selector: 'app-multi-results-dialog',
  templateUrl: './multi-results-dialog.component.html',
  styleUrls: ['./multi-results-dialog.component.scss']
})
export class MultiResultsDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MultiResultsDialogComponent>,
              private store: Store<fromApp.AppState>,
              public dialog: MatDialog) { }

  ngOnInit() {
  }

  get logEntries() {
    return this.store.select(LogSelectors.selectLogEntries);
  }

}
