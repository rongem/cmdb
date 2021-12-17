import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { withLatestFrom } from 'rxjs';
import { MetaDataActions, MetaDataSelectors, ErrorSelectors, JwtLoginService } from 'backend-access';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  lastError: any;
  showError = false;
  currentErrorMessage = '';
  preInit = true;
  private retryInterval: any;

  constructor(private store: Store,
    private router: Router,
    private jwt: JwtLoginService) {}

  get errorIsFatal() {
    return this.store.select(ErrorSelectors.selectErrorIsFatal);
  }

  get loadingData() {
    return this.store.select(MetaDataSelectors.selectLoadingData);
  }

  get validData() {
    return this.store.select(MetaDataSelectors.selectDataValid);
  }

  ngOnInit() {
    if (this.jwt.validLogin.value === false) {
      this.jwt.validLogin.pipe(withLatestFrom(this.validData)).subscribe(([value, validData]) => {
        if (value === true) {
          this.preInit = false;
          if (!validData) {
            this.store.dispatch(MetaDataActions.readState());
          }
        } else {
          if (!this.preInit) {
            this.router.navigate(['account', 'login']);
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
        this.displayError(error);
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

  displayError(error: string) {
    if (error && error !== '') {
      this.currentErrorMessage = error;
      this.showError = true;
      setTimeout(() => {
        this.showError = false;
      }, 8000);
    } else {
      this.showError = false;
    }
  }

}
