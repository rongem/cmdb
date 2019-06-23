import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../shared/store/app.reducer';
import { Subscription } from 'rxjs';
import { MetaDataService } from '../shared/meta-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userName: string;
  userRole: string;
  subscription: Subscription;

  constructor(private store: Store<fromApp.AppState>,
              private meta: MetaDataService) { }

  ngOnInit() {
    this.subscription = this.store.select(fromApp.METADATA).subscribe(stateData => {
      this.userName = stateData.userName;
      this.userRole = this.meta.getUserRole();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
