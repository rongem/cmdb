import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import * as DisplayActions from 'projects/cmdb/src/app/display/store/display.actions';
import * as fromDisplay from 'projects/cmdb/src/app/display/store/display.reducer';

@Component({
  selector: 'app-search-sidebar',
  templateUrl: './search-sidebar.component.html',
  styleUrls: ['./search-sidebar.component.scss']
})
export class SearchSidebarComponent implements OnInit {

  displayState: Observable<fromDisplay.State>;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.displayState = this.store.select(fromApp.DISPLAY);
  }

  setVisibility(visibilityState: fromDisplay.VisibleComponent) {
    this.store.dispatch(DisplayActions.setVisibilityState({visibilityState}));
  }
}
