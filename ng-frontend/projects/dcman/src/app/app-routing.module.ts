import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { RoomsComponent } from './rooms/rooms.component';
import { RoomComponent } from './rooms/room/room.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', component: RoomsComponent },
  { path: 'room/:id', component: RoomComponent },
  { path: 'asset', loadChildren: () => import('./asset/asset.module').then(m => m.AssetModule) },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
