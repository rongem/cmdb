import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AdminRoutingModule } from './admin-routing.module';
import { AttributeGroupsComponent } from './attribute-groups/attribute-groups.component';
import { AttributeTypesComponent } from './attribute-types/attribute-types.component';
import { ConnectionTypesComponent } from './connection-types/connection-types.component';
import { ItemTypesComponent } from './item-types/item-types.component';
import { ConnectionRulesComponent } from './connection-rules/connection-rules.component';
import { UsersComponent } from './users/users.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    AttributeGroupsComponent,
    AttributeTypesComponent,
    ConnectionTypesComponent,
    ItemTypesComponent,
    ConnectionRulesComponent,
    UsersComponent
  ],
  imports: [
    AdminRoutingModule,
    CommonModule,
    SharedModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule
  ]
})
export class AdminModule { }
