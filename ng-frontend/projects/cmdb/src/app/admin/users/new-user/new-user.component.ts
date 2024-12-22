import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, Observable, of, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { AdminActions, AdminFunctions, UserInfo } from 'backend-access';

@Component({
    selector: 'app-new-user',
    templateUrl: './new-user.component.html',
    styleUrls: ['./new-user.component.scss'],
    standalone: false
})
export class NewUserComponent implements OnInit {
  userForm: FormGroup;
  userProposals: Observable<UserInfo[]>;
  error: string;
  errorDetails: string[];

  constructor(private router: Router,
              private store: Store,
              private fb: FormBuilder,
              private http: HttpClient) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      userName: ['', [Validators.required]],
      role: [0, Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordRepeat: ['', [Validators.required, this.passwordsEqual]],
    });
  }

  onTextChange(target: EventTarget) {
    let searchText = (target as HTMLInputElement).value;
    if (searchText !== searchText.toLocaleLowerCase()) {
      this.userForm.get('userName').setValue(searchText.toLocaleLowerCase());
      searchText = searchText.toLocaleLowerCase();
    }
    if (!searchText || searchText.length < 3) {
      this.userProposals = new Observable<UserInfo[]>();
    } else {
      this.userProposals = AdminFunctions.searchUsers(this.http, searchText);
    }
  }

  passwordsEqual: ValidatorFn = (c: AbstractControl) => {
    if (this.userForm && this.userForm.value.password !== c.value) {
      return {passwordMismatchError: true};
    }
    return null;
  };

  createUser() {
    this.error = undefined;
    this.errorDetails = undefined;
    AdminFunctions.createUserWithoutErrorHandling(this.http, this.store,
      { accountName: this.userForm.value.userName, role: +this.userForm.value.role }, this.userForm.value.password).pipe(
        tap(user => {
          this.store.dispatch(AdminActions.storeUser({user}));
          this.router.navigate(['admin', 'users']);
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
