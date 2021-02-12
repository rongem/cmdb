import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { StoreConstants, MetaDataActions, JwtLoginService } from 'backend-access';

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
  get loginRequired() {
    return !this.jwt.validLogin.getValue();
  }

  constructor(private store: Store<fromApp.AppState>, private jwt: JwtLoginService) {}

  ngOnInit() {
    if (this.loginRequired) {
      this.jwt.validLogin.subscribe(value => {
        if (value === true) {
          this.readState();
        }
      });
    } else {
      this.readState();
    }
    this.store.select(StoreConstants.ERROR).subscribe(value => {
      if (this.lastError !== value.recentError) {
        console.log(value);
        this.displayError = value.recentError;
        this.lastError = value.recentError;
      }
    });
  }

  private readState() {
    this.store.dispatch(MetaDataActions.readState());
  }

  login() {}

  clearError() {
    this.displayError = undefined;
  }

}
