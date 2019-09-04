import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromDisplay from 'src/app/display/store/display.reducer';
import * as DisplayActions from 'src/app/display/store/display.actions';

@Component({
  selector: 'app-result-table',
  templateUrl: './result-table.component.html',
  styleUrls: ['./result-table.component.scss']
})
export class ResultTableComponent implements OnInit {
  displayStore: Observable<fromDisplay.State>;
  displayedColumns = ['type', 'name'];

  constructor(private router: Router,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.displayStore = this.store.select(fromApp.DISPLAY).pipe(
      tap(state => {
        if (state.result.resultListFullLoading === false && state.result.resultListFullPresent === false) {
          this.router.navigate(['display', 'search']);
        }
      })
    );
  }

}
