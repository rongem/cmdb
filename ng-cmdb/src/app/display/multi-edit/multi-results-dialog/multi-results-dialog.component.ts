import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectMultiEdit from 'src/app/display/store/multi-edit.selectors';

@Component({
  selector: 'app-multi-results-dialog',
  templateUrl: './multi-results-dialog.component.html',
  styleUrls: ['./multi-results-dialog.component.scss']
})
export class MultiResultsDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MultiResultsDialogComponent>,
              // @Inject(MAT_DIALOG_DATA) public data:,
              private store: Store<fromApp.AppState>,
              public dialog: MatDialog) { }

  ngOnInit() {
  }

  get logEntries() {
    return this.store.select(fromSelectMultiEdit.selectLogEntries);
  }

}