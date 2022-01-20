import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { of, tap, catchError, take, withLatestFrom, switchMap } from 'rxjs';
import { AdminFunctions, AppConfigService, MetaDataSelectors, UserInfo } from 'backend-access';
import { Router } from '@angular/router';
import { GlobalActions, GlobalSelectors } from '../../shared/store/store.api';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  userForm: FormGroup;
  error: string;
  errorDetails: string[];
  changing = false;
  private user: UserInfo;

  constructor(private store: Store,
              private fb: FormBuilder,
              private router: Router,
              private http: HttpClient) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      oldpassword: ['', [Validators.required, Validators.minLength(8)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordRepeat: ['', [Validators.required, this.passwordsEqual]],
    });
    AdminFunctions.getUsers(this.http).pipe(
      withLatestFrom(this.store.select(MetaDataSelectors.selectUserName))
    ).subscribe(([users, currentUser]) => {
      this.user = users.find(u => u.accountName === currentUser);
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
    this.changing = true;
    let url = AppConfigService.settings.backend.url;
    if (url.endsWith('rest/')) {
        url = url.substring(0, url.length - 5);
    }
    url += 'login';
    const accountName = this.user.accountName;
    const passphrase = this.userForm.value.oldpassword;
    this.http.post<{token: string}>(url, { accountName, passphrase }).pipe(
      take(1),
      switchMap(() => AdminFunctions.updateUserWithoutErrorHandling(this.http, this.store, this.user, this.userForm.value.password)),
      withLatestFrom(this.store.select(GlobalSelectors.desiredUrl)),
      tap(([, desiredUrl]) => {
        if (!!desiredUrl) {
          this.store.dispatch(GlobalActions.clearUrl());
          this.router.navigateByUrl(desiredUrl);
        } else {
          this.router.navigate(['search']);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.error = error.message;
        if (error.status === 422) {
          this.error = 'Server validation error';
        }
        if (error.status === 304) {
          this.error = 'Nothing changed';
        }
        if (error.error?.data?.errors) {
          this.errorDetails = error.error.data.errors.map((d: {param: string; msg: string}) => d.param + ': ' + d.msg);
        }
        return of(null);
    }),
    ).subscribe(() =>this.changing = false);
  }

  cancel() {
    this.store.select(GlobalSelectors.desiredUrl).pipe(
      take(1),
    ).subscribe(url => {
      if (!!url) {
        this.store.dispatch(GlobalActions.clearUrl());
        this.router.navigateByUrl(url);
      } else {
        this.router.navigate(['search']);
      }
    });
  }
}
