import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromAdmin from '../store/admin.reducer';
import * as AdminActions from '../store/admin.actions';

import { getNameForUserRole } from 'src/app/shared/store/functions';
import { UserRole } from 'src/app/shared/objects/user-role.enum';
import { UserRoleMapping } from 'src/app/shared/objects/user-role-mapping.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  state: Observable<fromAdmin.State>;

  constructor(private store: Store<fromApp.AppState>,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.store.dispatch(new AdminActions.ReadUsers());
    this.state = this.store.select(fromApp.ADMIN);
  }

  getRoleName(role: UserRole) {
    return getNameForUserRole(role);
  }

  onChangeRole(user: UserRoleMapping) {
    user.Role = 3 - user.Role;
  }

}
