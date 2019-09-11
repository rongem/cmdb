import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromApp from '../shared/store/app.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';

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
    return this.store.pipe(select(fromSelectMetaData.selectUserName));
  }

  get userRole() {
    return this.store.pipe(select(fromSelectMetaData.selectUserRole));
  }
}
