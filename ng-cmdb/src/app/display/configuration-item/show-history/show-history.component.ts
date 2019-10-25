import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';

import { Guid } from 'src/app/shared/guid';
import { HistoryEntry } from '../objects/history-entry.model';
import { getUrl } from 'src/app/shared/store/functions';
import { getRouterState } from 'src/app/shared/store/router/router.reducer';


@Component({
  selector: 'app-show-history',
  templateUrl: './show-history.component.html',
  styleUrls: ['./show-history.component.scss']
})
export class ShowHistoryComponent implements OnInit {
  private history: Observable<HistoryEntry[]>;
  private id: Guid;
  displayedColumns = ['date', 'subject', 'text', 'responsible'];

  constructor(private store: Store<fromApp.AppState>,
              public dialogRef: MatDialogRef<ShowHistoryComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Guid,
              public dialog: MatDialog,
              private route: ActivatedRoute,
              private http: HttpClient) { }

  ngOnInit() {
    this.store.pipe(select(getRouterState)).subscribe(state => this.id = state.state.params.id);
  }

  get historyEntries() {
    if (!this.history) {
      this.history = this.http.get<HistoryEntry[]>(getUrl('ConfigurationItem/' + this.id + '/history'));
    }
    return this.history;
  }

}
