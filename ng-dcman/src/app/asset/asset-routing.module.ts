import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RackComponent } from './rack/rack.component';
import { ItemsComponent } from './items/items.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'items' },
  { path: 'items', component: ItemsComponent },
  { path: 'rack/:id', component: RackComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetRoutingModule { }
