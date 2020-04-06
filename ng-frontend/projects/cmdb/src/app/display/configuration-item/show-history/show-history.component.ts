import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Guid } from 'projects/cmdb/src/app/shared/guid';
import { HistoryEntry } from 'projects/cmdb/src/app/display/objects/history-entry.model';
import { getUrl } from 'projects/cmdb/src/app/shared/store/functions';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-show-history',
  templateUrl: './show-history.component.html',
  styleUrls: ['./show-history.component.scss']
})
export class ShowHistoryComponent implements OnInit {
  history: MatTableDataSource<HistoryEntry>;
  displayedColumns = ['date', 'subject', 'text', 'responsible'];

  constructor(public dialogRef: MatDialogRef<ShowHistoryComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Guid,
              public dialog: MatDialog,
              private http: HttpClient) { }

  ngOnInit() {
    const sub = this.http.get<HistoryEntry[]>(
      getUrl('ConfigurationItem/' + this.data + '/history')).subscribe(
        entries => {
          this.history = new MatTableDataSource(entries);
          this.history.filterPredicate = (data, filter) => filter === '' || data.Scope === filter;
          sub.unsubscribe();
      }
    );
  }
}
