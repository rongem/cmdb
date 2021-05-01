import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MetaDataActions, MetaDataSelectors, ErrorSelectors, JwtLoginService } from 'backend-access';
import { withLatestFrom } from 'rxjs/operators';

import * as fromApp from './shared/store/app.reducer';
import { LoginFormComponent } from './shared/login-form/login-form.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  lastError: any;
  preInit = true;
  private retryInterval: any;

  constructor(private snackbar: MatSnackBar,
              private store: Store<fromApp.AppState>,
              private dialog: MatDialog,
              private jwt: JwtLoginService) {}

  ngOnInit() {
    if (this.jwt.validLogin.value === false) {
      this.dialog.open(LoginFormComponent, {width: 'auto', disableClose: true, data: {message: ''}}).afterClosed().subscribe();
      this.jwt.validLogin.pipe(withLatestFrom(this.validData)).subscribe(([value, validData]) => {
        if (value === true) {
          this.preInit = false;
          if (!validData) {
            this.store.dispatch(MetaDataActions.readState());
          }
        } else {
          if (!this.preInit) {
            this.dialog.open(LoginFormComponent, {
              width: 'auto',
              hasBackdrop: true,
              disableClose: true,
              data: {error: this.lastError?.message ?? this.lastError, message: 'Login expired'}
            });
          }
        }
      });
    } else {
      this.store.dispatch(MetaDataActions.readState());
      this.preInit = false;
    }
    this.store.select(ErrorSelectors.selectRecentError).pipe(
      withLatestFrom(this.loadingData, this.validData),
    ).subscribe(([error, loadingData, validData]) => {
      if (error && this.lastError !== error) {
        this.openSnackbar(error);
        this.lastError = error;
      }
      // retry loading every 10 seconds if it fails
      if (!validData && !loadingData && !this.retryInterval && this.jwt.validLogin.value === true) {
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
