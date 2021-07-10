import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Actions, ofType } from '@ngrx/effects';
import { SearchActions } from 'backend-access';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  constructor(private actions$: Actions,
              private router: Router) { }

  ngOnInit() {
    this.subscription = this.actions$.pipe(
      ofType(SearchActions.setResultListFull),
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
