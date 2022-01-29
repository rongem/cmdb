import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { UserInfo, UserRole, AdminActions, AppConfigService } from 'backend-access';

import * as AdminSelectors from '../store/admin.selectors';

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
