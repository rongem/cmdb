import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

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

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.displayState = this.store.select(fromApp.DISPLAY);
  }

  setVisibility(visibilityState: fromDisplay.VisibleComponent) {
    this.store.dispatch(DisplayActions.setVisibilityState({visibilityState}));
  }

  toggleVisibility(resultListToforeground: boolean) {
    // this.store.dispatch(new SearchActions.ToggleVisibility(resultListToforeground));
  }
}
