import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { catchError, of, switchMap, take, tap, withLatestFrom } from 'rxjs';
import { AdminFunctions, AppConfigService, MetaDataSelectors, UserInfo } from 'backend-access';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changeOwn = false;
  userForm: FormGroup;
  error: string;
  errorDetails: string[];
  private user: UserInfo;

  constructor(public dialogRef: MatDialogRef<ChangePasswordComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string | UserInfo,
              private store: Store,
              private fb: FormBuilder,
              private http: HttpClient) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      oldpassword: ['', [Validators.required, Validators.minLength(8)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordRepeat: ['', [Validators.required, this.passwordsEqual]],
    });
    AdminFunctions.getUsers(this.http).pipe(withLatestFrom(this.store.select(MetaDataSelectors.selectUserName))).subscribe(([users, currentUser]) => {
      if (typeof this.data === 'string') {
        this.changeOwn = true;
        this.user = users.find(u => u.accountName === this.data);
      } else {
        this.userForm.removeControl('oldpassword');
        this.user = users.find(u => u.accountName === (this.data as UserInfo).accountName);
      }
    });
  }

  passwordsEqual = (c: FormControl) => {
    if (this.userForm && this.userForm.value.password !== c.value) {
      return {passwordMismatchError: true};
    }
    return null;
  };

  updatePassword() {
    this.error = undefined;
    this.errorDetails = undefined;
    if (typeof this.data === 'string') {
      let url = AppConfigService.settings.backend.url;
      if (url.endsWith('rest/')) {
          url = url.substring(0, url.length - 5);
      }
      url += 'login';
      const accountName = this.data;
      const passphrase = this.userForm.value.oldpassword;
      this.http.post<{token: string}>(url, { accountName, passphrase }).pipe(
        take(1),
        switchMap(() => AdminFunctions.updateUserWithoutErrorHandling(this.http, this.store, this.user, this.userForm.value.password)),
        tap(() => {
          this.dialogRef.close();
        }),
        catchError((error: HttpErrorResponse) => {
          this.error = error.message;
          if (error.status === 422) {
            this.error = 'Server validation error';
          }
          if (error.error?.data?.errors) {
            this.errorDetails = error.error.data.errors.map((d: {param: string; msg: string}) => d.param + ': ' + d.msg);
          }
          return of(null);
      }),
      ).subscribe();
    } else {
      AdminFunctions.updateUserWithoutErrorHandling(this.http, this.store, this.user, this.userForm.value.password).pipe(
          tap(() => {
            this.dialogRef.close();
          }),
          catchError((error: HttpErrorResponse) => {
            this.error = error.message;
            if (error.status === 422) {
              this.error = 'Server validation error';
            }
            if (error.error?.data?.errors) {
              this.errorDetails = error.error.data.errors.map((d: {param: string; msg: string}) => d.param + ': ' + d.msg);
            }
            return of(null);
          })
        ).subscribe();
    }
  }
}
