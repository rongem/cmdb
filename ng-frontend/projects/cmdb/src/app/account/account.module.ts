import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { AccountRoutingModule } from './account-routing.module';


@NgModule({
  declarations: [
    LoginFormComponent,
    ChangePasswordComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AccountRoutingModule,
  ]
})
export class AccountModule { }
