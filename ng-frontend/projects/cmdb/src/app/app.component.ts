import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MetaDataStore, MetaDataActions, MetaDataSelectors, ErrorSelectors } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import { withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  lastError: any;
  private retryInterval: any;

  constructor(private snackbar: MatSnackBar,
              private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.store.dispatch(MetaDataActions.readState());
    this.store.pipe(
      select(ErrorSelectors.selectRecentError),
      withLatestFrom(this.loadingData, this.validData),
    ).subscribe(([error, loadingData, validData]) => {
      console.log(error);
      if (this.lastError !== error) {
        this.openSnackbar(error);
        this.lastError = error;
      }
      // retry loading every 10 seconds if it fails
      if (!validData && !loadingData && !this.retryInterval) {
        this.retryInterval = setInterval(() => {
          if (!loadingData) {
            this.store.dispatch(MetaDataActions.readState());
          }
        }, 10000);
      }
      // stop retrying if loading succeeds
      if (validData && !!this.retryInterval) {
        clearInterval(this.retryInterval);
        this.retryInterval = undefined;
      }
    });
  }

  get loadingData() {
    return this.store.select(MetaDataSelectors.selectLoadingData);
  }

  get validData() {
    return this.store.select(MetaDataSelectors.selectDataValid);
  }

  openSnackbar(error: string) {
    if (error && error !== '') {
      this.snackbar.open(error, '', { duration: 8000 });
    } else {
      this.snackbar.dismiss();
    }
  }

}
