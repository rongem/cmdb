import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import * as fromAdmin from '../store/admin.reducer';

import { UserRoleMapping, UserInfo, UserRole, AdminActions } from 'backend-access';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  state: Observable<fromAdmin.State>;
  userProposals: Observable<UserInfo[]>;
  userName: string;
  userRole: UserRole;
  createMode = false;

  constructor(private store: Store<fromApp.AppState>,
              public dialog: MatDialog,
              private adminService: AdminService) { }

  ngOnInit() {
    this.store.dispatch(AdminActions.readUsers());
    this.state = this.store.select(fromApp.ADMIN);
  }

  onTextChange(searchText: string) {
    if (!searchText || searchText.length < 3) {
      this.userProposals = new Observable<UserInfo[]>();
    } else {
      this.userProposals = this.adminService.searchUsers(searchText);
    }
  }

  onCancel() {
    this.createMode = false;
  }

  onCreate() {
    this.userName = '';
    this.userRole = UserRole.Editor;
    this.createMode = true;
  }

  onCreateUserRoleMapping() {
    const userRoleMapping: UserRoleMapping = {
      isGroup: false,
      role: this.userRole,
      username: this.userName,
    };
    this.store.dispatch(AdminActions.addUser({userRoleMapping}));
    this.onCancel();
  }

  onChangeRole(user: UserRoleMapping) {
    this.store.dispatch(AdminActions.toggleRole({user: user.username}));
  }

  onDeleteUser(user: UserRoleMapping, withResponsibilities: boolean) {
    this.store.dispatch(AdminActions.deleteUser({ user, withResponsibilities}));
  }

}
