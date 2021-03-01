import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { UserInfo, UserRole, AdminActions, AdminFunctions, AppConfigService } from 'backend-access';

import * as fromApp from '../../shared/store/app.reducer';
import * as fromAdmin from '../store/admin.reducer';
import { NewUserComponent } from './new-user/new-user.component';
import { ChangePasswordComponent } from '../../shared/change-password/change-password.component';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  state: Observable<fromAdmin.State>;
  userProposals: Observable<UserInfo[]>;
  userName: string;
  currentUser: UserInfo;
  userRole: UserRole;
  createMode = false;

  get passwordRequired() {
    return AppConfigService.settings.backend.authMethod === 'jwt';
  }

  constructor(private store: Store<fromApp.AppState>,
              public dialog: MatDialog,
              private http: HttpClient) { }

  ngOnInit() {
    this.store.dispatch(AdminActions.readUsers());
    this.state = this.store.select(fromApp.ADMIN);
  }

  onTextChange(searchText: string) {
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
      this.userRole = UserRole.Editor;
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
    this.store.dispatch(AdminActions.updateUser({user: {...user, role: user.role === UserRole.Editor ? UserRole.Administrator : UserRole.Editor}}));
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
