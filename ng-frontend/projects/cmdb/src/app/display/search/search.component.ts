import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { SearchActions } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import * as fromDisplay from 'projects/cmdb/src/app/display/store/display.reducer';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  displayState: Observable<fromDisplay.State>;

  constructor(private store: Store<fromApp.AppState>,
              private actions$: Actions,
              private router: Router) { }

  ngOnInit() {
    this.displayState = this.store.select(fromApp.DISPLAY);
    this.subscription = this.actions$.pipe(
      ofType(SearchActions.setResultList),
      map(value => value.configurationItems.length)
      ).subscribe((value) => {
        if (value > 0) {
          this.router.navigate(['display', 'results']);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
