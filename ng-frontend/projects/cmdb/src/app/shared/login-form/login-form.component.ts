import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ErrorSelectors, JwtLoginService } from 'backend-access';
import { catchError, skipUntil, skipWhile, take, takeUntil, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  accountName: string;
  passphrase: string;
  error: string;
  message: string;

  constructor(private jwt: JwtLoginService,
              public dialogRef: MatDialogRef<LoginFormComponent>,
              private store: Store,
              @Inject(MAT_DIALOG_DATA) public data: {error?: string, message?: string}) { }

  ngOnInit(): void {
    this.error = this.data.error;
    this.message = this.data.message;
    this.store.select(ErrorSelectors.selectRecentError).subscribe(error => this.error = error);
  }

  doLogin() {
    this.jwt.validLogin.pipe(
      skipWhile(value => value === false),
      take(1)
    ).subscribe(() => {
      this.dialogRef.close();
    });
    this.jwt.login(this.accountName, this.passphrase);
  }

}
