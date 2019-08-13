import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromAdmin from '../store/admin.reducer';
import * as AdminActions from '../store/admin.actions';

import { UserRoleMapping } from 'src/app/shared/objects/user-role-mapping.model';
import { UserInfo } from 'src/app/shared/objects/user-info.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  state: Observable<fromAdmin.State>;
  userProposals: UserInfo[] = [];
  createMode = false;

  constructor(private store: Store<fromApp.AppState>,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.store.dispatch(new AdminActions.ReadUsers());
    this.state = this.store.select(fromApp.ADMIN);
  }

  onTextChange(event) {
    console.log(event);
  }

  onCreate() {
    this.createMode = true;
  }

  onChangeRole(user: UserRoleMapping) {
    this.store.dispatch(new AdminActions.ToggleRole(user.Username));
  }

  onDeleteUser(user: UserRoleMapping, withResponsibilities: boolean) {
    this.store.dispatch(new AdminActions.DeleteUser({ user, withResponsibilities}));
  }

}
