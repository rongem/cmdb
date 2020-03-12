import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelsComponent } from './models/models.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ModelComponent } from './models/model/model.component';



@NgModule({
  declarations: [
    ModelsComponent,
    ModelComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
  ]
})
export class AdminModule { }
