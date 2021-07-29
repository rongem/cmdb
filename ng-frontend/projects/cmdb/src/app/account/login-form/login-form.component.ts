import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ErrorSelectors, JwtLoginService } from 'backend-access';
import { skipWhile, take, withLatestFrom } from 'rxjs/operators';
import { GlobalActions, GlobalSelectors } from '../../shared/store/store.api';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  accountName: string;
  passphrase: string;
  error: string;

  constructor(private jwt: JwtLoginService,
              private store: Store,
              private router: Router) { }

  ngOnInit(): void {
    this.store.select(ErrorSelectors.selectRecentError).subscribe(error => this.error = error);
  }

  doLogin() {
    this.jwt.validLogin.pipe(
      skipWhile(value => value === false),
      take(1),
      withLatestFrom(this.store.select(GlobalSelectors.desiredUrl)),
    ).subscribe(([, url]) => {
      if (!!url) {
        this.store.dispatch(GlobalActions.clearUrl());
        this.router.navigateByUrl(url);
      } else {
        this.router.navigate(['search']);
      }
    });
    this.jwt.login(this.accountName, this.passphrase);
  }

}
