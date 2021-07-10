import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { EditAuthGuard } from './shared/edit-auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'display', pathMatch: 'full'},
  { path: 'display', loadChildren: () => import('./display/display.module').then(m => m.DisplayModule) },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)},
  { path: 'edit', canActivate: [EditAuthGuard], loadChildren: () => import('./edit/edit.module').then(m => m.EditModule) },
  { path: '**', redirectTo: 'display' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
