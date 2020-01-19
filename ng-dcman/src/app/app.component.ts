import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromMetaData from 'src/app/shared/store/meta-data.reducer';
import * as MetaDataActions from 'src/app/shared/store/meta-data.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ng-dcman';
  lastError: any;
  meta: Observable<fromMetaData.State>;
  private retryInterval;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.meta = this.store.select(fromApp.METADATA);
    this.store.dispatch(MetaDataActions.readState());
    this.meta.subscribe((value: fromMetaData.State) => {
      if (this.lastError !== value.error) {
        // this.openSnackbar(value.error);
        this.lastError = value.error;
      }
      // retry loading every 10 seconds if it fails
      if (!value.validData && !value.loadingData && !this.retryInterval) {
        this.retryInterval = setInterval(() => {
          if (!value.loadingData) {
            this.store.dispatch(MetaDataActions.readState());
          }
        }, 10000);
      }
      // stop retrying if loading succeeds
      if (value.validData && !!this.retryInterval) {
        clearInterval(this.retryInterval);
        this.retryInterval = undefined;
      }
    });
  }

}
