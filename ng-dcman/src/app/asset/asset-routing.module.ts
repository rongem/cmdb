import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RackComponent } from './rack/rack.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', component: RackComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetRoutingModule { }
