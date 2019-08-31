import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromAdmin from '../store/admin.reducer';
import * as AdminActions from '../store/admin.actions';

import { UserRoleMapping } from 'src/app/shared/objects/user-role-mapping.model';
import { UserInfo } from 'src/app/shared/objects/user-info.model';
import { AdminService } from '../admin.service';
import { UserRole } from 'src/app/shared/objects/user-role.enum';

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
    if (!searchText || searchText.length < 3){
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
      IsGroup: false,
      Role: this.userRole,
      Username: this.userName,
    };
    this.store.dispatch(AdminActions.addUser({userRoleMapping}));
    this.onCancel();
  }

  onChangeRole(user: UserRoleMapping) {
    this.store.dispatch(AdminActions.toggleRole({user: user.Username}));
  }

  onDeleteUser(user: UserRoleMapping, withResponsibilities: boolean) {
    this.store.dispatch(AdminActions.deleteUser({ user, withResponsibilities}));
  }

}
