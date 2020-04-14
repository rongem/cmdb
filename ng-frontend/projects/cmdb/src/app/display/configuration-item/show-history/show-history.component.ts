import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Guid, HistoryEntry, Functions, StoreConstants } from 'backend-access';


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
      Functions.getUrl(StoreConstants.CONFIGURATIONITEM + this.data + '/history')).subscribe(
        entries => {
          this.history = new MatTableDataSource(entries);
          this.history.filterPredicate = (data, filter) => filter === '' || data.scope === filter;
          sub.unsubscribe();
      }
    );
  }
}
