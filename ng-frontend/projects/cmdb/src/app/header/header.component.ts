import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MetaDataSelectors, AppConfigService, JwtLoginService } from 'backend-access';
import { Subject } from 'rxjs';

import * as fromApp from '../shared/store/app.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  remainingTime: Subject<string> = new Subject();
  interval: number;

  constructor(private store: Store<fromApp.AppState>, private jwt: JwtLoginService, private router: Router) { }

  ngOnInit() {
    if (this.logoutPossible) {
      this.interval = window.setInterval(() => {
        if (this.jwt.expiryDate) {
          this.remainingTime.next(new Date(this.jwt.expiryDate.valueOf() - Date.now()).toISOString().substr(11, 8));
        }
      }, 1000);
    }
  }

  ngOnDestroy() {
    if (this.interval) {
      window.clearInterval(this.interval);
    }
  }

  get logoutPossible() {
    return AppConfigService.settings.backend.authMethod === 'jwt';
  }

  get userName() {
    return this.store.select(MetaDataSelectors.selectUserName);
  }

  get userRole() {
    return this.store.select(MetaDataSelectors.selectUserRole);
  }

  logout() {
    if (this.interval) {
      window.clearInterval(this.interval);
      this.interval = undefined;
    }
    this.jwt.logout();
    this.router.navigateByUrl('/');
  }
}
