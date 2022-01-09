import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AdminAuthGuard } from './shared/guards/admin-auth.guard';
import { AuthGuard } from './shared/guards/auth.guard';
import { EditAuthGuard } from './shared/guards/edit-auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/display'},
  { path: 'admin', canActivate: [AuthGuard, AdminAuthGuard], loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)},
  { path: 'display', canActivate: [AuthGuard], loadChildren: () => import('./display/display.module').then(m => m.DisplayModule) },
  { path: 'edit', canActivate: [AuthGuard, EditAuthGuard], loadChildren: () => import('./edit/edit.module').then(m => m.EditModule) },
  {
    path: 'edit-multiple-items',
    canActivate: [AuthGuard, EditAuthGuard],
    loadChildren: () => import('./multi-edit/multi-edit.module').then(m =>m.MultiEditModule)
  },
  { path: 'search', canActivate: [AuthGuard], loadChildren: () => import('./search/search.module').then(m => m.SearchModule) },
  { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule)},
  { path: '**', redirectTo: '/search' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
