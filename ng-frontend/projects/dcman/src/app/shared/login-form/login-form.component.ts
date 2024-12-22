import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { JwtLoginService } from 'backend-access';

@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.scss'],
    standalone: false
})
export class LoginFormComponent implements OnInit {
  accountName: string;
  passphrase: string;

  constructor(private jwt: JwtLoginService) { }

  ngOnInit(): void {
  }

  doLogin() {
    this.jwt.login(this.accountName, this.passphrase);
  }

}
