import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelsComponent } from './models/models.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ModelComponent } from './models/model/model.component';
import { SharedModule } from '../shared/shared.module';
import { ModelItemComponent } from './models/model-item/model-item.component';



@NgModule({
  declarations: [
    ModelsComponent,
    ModelComponent,
    ModelItemComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
  ]
})
export class AdminModule { }
