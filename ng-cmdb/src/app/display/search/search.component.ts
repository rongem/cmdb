import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSearch from './store/search.reducer';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  searchStore: Observable<fromSearch.SearchState>;
  visibilityState = false;
  resultListToforeground = false;
  resultSubscription: Subscription;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.searchStore = this.store.select(fromApp.SEARCH);
    this.resultSubscription = this.searchStore.subscribe((value) => {
      this.toggleVisibility(value.resultListPresent);
    });
  }

  ngOnDestroy() {
    this.resultSubscription.unsubscribe();
  }

  toggleVisibility(resultListToforeground: boolean) {
    if (this.visibilityState === false || this.resultListToforeground === resultListToforeground) {
      this.visibilityState = !this.visibilityState;
    }
    this.resultListToforeground = resultListToforeground;
  }
}
