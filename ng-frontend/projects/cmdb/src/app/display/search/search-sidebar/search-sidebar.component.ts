import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DisplayActions, DisplaySelectors } from '../../../shared/store/store.api';
import { VisibleComponent } from '../../../shared/store/display/visible-component.enum';

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

  setVisibility(visibilityState: VisibleComponent) {
    this.store.dispatch(DisplayActions.setVisibilityState({visibilityState}));
  }
}
