import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { catchError, Observable, of, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { UserInfo, UserRole, AdminActions, AppConfigService, MetaDataSelectors, AdminFunctions } from 'backend-access';

import * as AdminSelectors from '../store/admin.selectors';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  userProposals: Observable<UserInfo[]>;
  userName: string;
  error: string;
  errorDetails: string;
  currentUser: UserInfo;
  passwordForm: FormGroup;
  userRole: UserRole;
  constructor(private store: Store,
              private fb: FormBuilder,
              private http: HttpClient) { }

  get users() {
    return this.store.select(AdminSelectors.selectUsers);
  }

  get passwordRequired() {
    return AppConfigService.settings.backend.authMethod === 'jwt';
  }

  ngOnInit() {
    this.store.dispatch(AdminActions.readUsers());
    this.store.select(MetaDataSelectors.selectUserName).pipe(take(1)).subscribe(userName => {
      this.userName = userName;
    });
  }

  onChangeRole(user: UserInfo) {
    this.store.dispatch(AdminActions.updateUser({user: {...user, role: user.role === UserRole.editor ? UserRole.administrator : UserRole.editor}}));
  }

  onSetRole(role: UserRole) {
    this.store.dispatch(AdminActions.updateUser({user: {...this.currentUser, role}}));
  }

  onDeleteUser(user: UserInfo, withResponsibilities: boolean) {
    this.store.dispatch(AdminActions.deleteUser({ user, withResponsibilities}));
  }

  onChangePassword(user: UserInfo) {
    this.currentUser = user;
    this.passwordForm = this.fb.group({
      password: this.fb.control('', [Validators.required, Validators.minLength(8)]),
      repeatPassword: this.fb.control('', [Validators.required, Validators.minLength(8)])
    }, {validators: [this.passwordsEqual] });
  }

  onSavePassword() {
    AdminFunctions.updateUserWithoutErrorHandling(this.http, this.store, this.currentUser, this.passwordForm.value.password).pipe(
      take(1),
      catchError(error => {
        this.error = error.message;
        if (error.status === 400) {
          this.error = 'Server validation error';
        }
        if (error.error?.data?.errors) {
          this.errorDetails = error.error.data.errors.map((d: {param: string; msg: string}) => d.param + ': ' + d.msg);
        }
        return of(null);
      })
    ).subscribe(user => {
      if (user !== null) {
        this.currentUser = undefined;
      }
    });
  }

  private passwordsEqual: ValidatorFn = (c: AbstractControl) => {
    if (c.value.password !== c.value.repeatPassword) {
      return {passwordMismatchError: true};
    }
    return null;
  };

}
