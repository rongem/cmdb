import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
    ReactiveFormsModule,
    AccountRoutingModule,
  ],
})
export class AccountModule { }
