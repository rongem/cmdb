import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JwtLoginService } from 'backend-access';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  accountName: string;
  passphrase: string;

  constructor(private jwt: JwtLoginService,
              public dialogRef: MatDialogRef<LoginFormComponent>/*,
              @Inject(MAT_DIALOG_DATA) public data: string*/) { }

  ngOnInit(): void {
  }

  doLogin() {
    this.jwt.login(this.accountName, this.passphrase);
    this.dialogRef.close();
  }

}
