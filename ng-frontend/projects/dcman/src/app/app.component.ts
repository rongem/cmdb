import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { StoreConstants, MetaDataActions } from 'backend-access';

import * as fromApp from './shared/store/app.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ng-dcman';
  lastError: string;
  displayError: string;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.store.dispatch(MetaDataActions.readState());
    this.store.select(StoreConstants.ERROR).subscribe(value => {
      if (this.lastError !== value.recentError) {
        console.log(value);
        this.lastError = value.recentError;
      }
    });
  }

  clearError() {
    this.displayError = undefined;
  }

}
