import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { UserInfo, UserRole, AdminActions, AdminFunctions, AppConfigService } from 'backend-access';

import * as AdminSelectors from '../store/admin.selectors';

import { NewUserComponent } from './new-user/new-user.component';
import { ChangePasswordComponent } from '../../account/change-password/change-password.component';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  userProposals: Observable<UserInfo[]>;
  userName: string;
  currentUser: UserInfo;
  userRole: UserRole;
  createMode = false;
  constructor(private store: Store,
              public dialog: MatDialog,
              private http: HttpClient) { }

  get users() {
    return this.store.select(AdminSelectors.selectUsers);
  }

  get passwordRequired() {
    return AppConfigService.settings.backend.authMethod === 'jwt';
  }

  ngOnInit() {
    this.store.dispatch(AdminActions.readUsers());
  }

  onTextChange(target: EventTarget) {
    const searchText = (target as HTMLInputElement).value;
    if (!searchText || searchText.length < 3) {
      this.userProposals = new Observable<UserInfo[]>();
    } else {
      this.userProposals = AdminFunctions.searchUsers(this.http, searchText);
    }
  }

  onCancel() {
    this.createMode = false;
  }

  onCreate() {
    if (AppConfigService.settings.backend.authMethod === 'jwt') {
      this.dialog.open(NewUserComponent, {width: 'auto'}).afterClosed().subscribe(() => {
      });
    } else {
      this.userName = '';
      this.userRole = UserRole.editor;
      this.createMode = true;
    }
  }

  onCreateUserRoleMapping() {
    const user: UserInfo = {
      role: this.userRole,
      accountName: this.userName,
    };
    this.store.dispatch(AdminActions.storeUser({user}));
    this.onCancel();
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
    this.dialog.open(ChangePasswordComponent, {width: 'auto', data: user});
  }
}
