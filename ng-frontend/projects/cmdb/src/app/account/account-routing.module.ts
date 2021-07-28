import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LoginFormComponent } from './login-form/login-form.component';

const loginRoutes: Routes = [
    { path: 'login', component: LoginFormComponent },
    { path: 'password', canActivate: [AuthGuard], component: ChangePasswordComponent },
];

@NgModule({
    imports: [RouterModule.forChild(loginRoutes)],
    exports: [RouterModule]
})
export class AccountRoutingModule {}
