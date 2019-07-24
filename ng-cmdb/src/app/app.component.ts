import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromMetaData from 'src/app/shared/store/meta-data.reducer';
import { METADATA } from './shared/store/app.reducer';
import { HttpErrorResponse } from '@angular/common/http';
import { Result } from './shared/objects/result.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ng-cmdb';
  lastError: any;

  constructor(private snackbar: MatSnackBar,
              private meta: Store<fromMetaData.State>) {}

  ngOnInit() {
    this.meta.select(fromApp.METADATA).subscribe((value: fromMetaData.State) => {
      if (this.lastError !== value.error) {
        this.openSnackbar(value.error);
        this.lastError = value.error;
      }
    });
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
