import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSearch from './store/search.reducer';
import * as SearchActions from './store/search.actions';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searchStore: Observable<fromSearch.SearchState>;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.searchStore = this.store.select(fromApp.SEARCH);
  }

  toggleVisibility(resultListToforeground: boolean) {
    this.store.dispatch(new SearchActions.ToggleVisibility(resultListToforeground));
  }
}
