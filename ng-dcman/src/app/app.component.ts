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

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.meta = this.store.select(fromApp.METADATA);
    this.store.dispatch(MetaDataActions.readState({resetRetryCount: true}));
    this.meta.subscribe((value: fromMetaData.State) => {
      if (this.lastError !== value.error) {
        // this.openSnackbar(value.error);
        this.lastError = value.error;
      }
    });
  }

}
