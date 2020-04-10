import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MetaDataSelectors } from 'backend-access';

import * as fromApp from '../shared/store/app.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
  }

  get userName() {
    return this.store.select(MetaDataSelectors.selectUserName);
  }

  get userRole() {
    return this.store.select(MetaDataSelectors.selectUserRole);
  }
}
