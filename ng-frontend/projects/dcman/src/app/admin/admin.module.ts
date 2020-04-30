import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelsComponent } from './models/models.component';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ModelItemComponent } from './models/model-item/model-item.component';
import { ModelFormComponent } from './models/model-form/model-form.component';



@NgModule({
  declarations: [
    ModelsComponent,
    ModelItemComponent,
    ModelFormComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
  ]
})
export class AdminModule { }
