import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as DisplayActions from 'src/app/display/store/display.actions';
import * as fromDisplay from 'src/app/display/store/display.reducer';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  displayState: Observable<fromDisplay.State>;

  constructor(private store: Store<fromApp.AppState>,
              private actions$: Actions,
              private router: Router) { }

  ngOnInit() {
    this.displayState = this.store.select(fromApp.DISPLAY);
    this.actions$.pipe(
      ofType(DisplayActions.setResultList),
      take(1),
      map(value => value.configurationItems.length)
      ).subscribe((value) => {
        console.log(value);
        if (value > 0) {
          this.router.navigate(['display', 'results']);
      }
    });
  }
}
