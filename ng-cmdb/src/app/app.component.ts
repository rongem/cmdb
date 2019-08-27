import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Store, select } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromMetaData from 'src/app/shared/store/meta-data.reducer';
import * as MetaDataActions from 'src/app/shared/store/meta-data.actions';
import * as fromRoot from 'src/app/shared/store/meta-data.selectors';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ng-cmdb';
  lastError: any;

  constructor(private snackbar: MatSnackBar,
              private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.store.dispatch(new MetaDataActions.ReadState());
    this.store.select(fromApp.METADATA).subscribe((value: fromMetaData.State) => {
      if (this.lastError !== value.error) {
        this.openSnackbar(value.error);
        this.lastError = value.error;
      }
    });
    this.store.pipe(select(fromRoot.selectAttributeTypesForItemType, '15acca82-6412-49e0-846e-22d6e22367cf')).subscribe(
      (value) => console.log(value)
    );
  }

  openSnackbar(error: HttpErrorResponse | string) {
    if (error) {
      let message = '';
      if (error instanceof HttpErrorResponse) {
        console.log(error);
        if (error.error && error.error.Message) {
          message = error.error.Message;
        } else if (error.message) {
          message = error.message;
        }
      } else if (typeof error === 'string') {
        message = error;
      }
      this.snackbar.open(message, '', { duration: 5000 });
    } else {
      this.snackbar.dismiss();
    }
  }

}
