import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModelsComponent } from './models/models.component';
import { ModelComponent } from './models/model/model.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'models' },
  { path: 'models', component: ModelsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
