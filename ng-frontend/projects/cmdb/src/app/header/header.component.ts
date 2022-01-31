import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MetaDataSelectors, AppConfigService, JwtLoginService } from 'backend-access';
import { Subject } from 'rxjs';
import { GlobalActions } from '../shared/store/store.api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  remainingTime: Subject<string> = new Subject();
  private interval: number;

  constructor(private store: Store,
              private jwt: JwtLoginService,
              private router: Router) { }

  get logoutPossible() {
    return AppConfigService.settings.backend.authMethod === 'jwt';
  }

  get userName() {
    return this.store.select(MetaDataSelectors.selectUserName);
  }

  get userRole() {
    return this.store.select(MetaDataSelectors.selectUserRole);
  }

  ngOnInit(): void {
    if (this.logoutPossible) {
      this.interval = window.setInterval(() => {
        if (this.jwt.expiryDate) {
          this.remainingTime.next(new Date(this.jwt.expiryDate.valueOf() - Date.now()).toISOString().substring(11, 19));
        }
      }, 1000);
    }
  }

  ngOnDestroy(): void {
    if (this.interval) {
      window.clearInterval(this.interval);
    }
  }

  logout() {
    if (this.interval) {
      window.clearInterval(this.interval);
      this.interval = undefined;
    }
    this.jwt.logout();
    this.router.navigate(['account', 'login']);
  }

  onChangePassword() {
    this.store.dispatch(GlobalActions.setUrl({url: this.router.url}));
  }
}
