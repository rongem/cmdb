import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisplayComponent } from './display/display.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  { path: '', redirectTo: 'display', pathMatch: 'full'},
  // { path: 'display', loadChildren: './display/display.module#DisplayModule' },
  { path: 'admin', component: AdminComponent, children: []},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
