import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { canActivateAdmin } from './shared/guards/admin-auth.guard';
import { canActivateAuth } from './shared/guards/auth.guard';
import { canActivateEdit } from './shared/guards/edit-auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/display'},
  { path: 'admin', canActivate: [canActivateAuth, canActivateAdmin], loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)},
  { path: 'display', canActivate: [canActivateAuth], loadChildren: () => import('./display/display.module').then(m => m.DisplayModule) },
  { path: 'edit', canActivate: [canActivateAuth, canActivateEdit], loadChildren: () => import('./edit/edit.module').then(m => m.EditModule) },
  { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule)},
  { path: '**', redirectTo: '/display' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
