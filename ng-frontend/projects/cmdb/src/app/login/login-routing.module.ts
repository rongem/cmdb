import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent } from './login-form/login-form.component';

const loginRoutes: Routes = [
    { path: '', pathMatch: 'full', component: LoginFormComponent },
];

@NgModule({
    imports: [RouterModule.forChild(loginRoutes)],
    exports: [RouterModule]
})
export class LoginRoutingModule {}
