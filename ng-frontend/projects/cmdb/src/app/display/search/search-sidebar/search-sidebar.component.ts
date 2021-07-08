import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from '../../../shared/store/app.reducer';
import * as DisplayActions from '../../store/display.actions';
import * as fromDisplay from '../../store/display.reducer';
import * as DisplaySelectors from '../../store/display.selectors';

@Component({
  selector: 'app-search-sidebar',
  templateUrl: './search-sidebar.component.html',
  styleUrls: ['./search-sidebar.component.scss']
})
export class SearchSidebarComponent implements OnInit {

  get visibleComponent() {
    return this.store.select(DisplaySelectors.selectVisibleComponent);
  }

  get resultListPresent() {
    return this.store.select(DisplaySelectors.selectResultListPresent);
  }


  constructor(private store: Store) { }

  ngOnInit() {}

  setVisibility(visibilityState: fromDisplay.VisibleComponent) {
    this.store.dispatch(DisplayActions.setVisibilityState({visibilityState}));
  }
}
