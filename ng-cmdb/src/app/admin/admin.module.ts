import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { ColorPickerModule } from 'ngx-color-picker';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminNavbarComponent } from './admin-navbar/admin-navbar.component';
import { AttributeGroupsComponent } from './attribute-groups/attribute-groups.component';
import { AttributeTypesComponent } from './attribute-types/attribute-types.component';
import { ConnectionTypesComponent } from './connection-types/connection-types.component';
import { ItemTypesComponent } from './item-types/item-types.component';
import { ConnectionRulesComponent } from './connection-rules/connection-rules.component';
import { UsersComponent } from './users/users.component';
import { SharedModule } from '../shared/shared.module';
import { DeleteAttributeTypeComponent } from './attribute-types/delete-attribute-type/delete-attribute-type.component';



@NgModule({
  declarations: [
    AdminComponent,
    AdminNavbarComponent,
    AttributeGroupsComponent,
    AttributeTypesComponent,
    ConnectionTypesComponent,
    ItemTypesComponent,
    ConnectionRulesComponent,
    UsersComponent,
    DeleteAttributeTypeComponent,
  ],
  imports: [
    AdminRoutingModule,
    CommonModule,
    SharedModule,
    MatIconModule,
    MatTooltipModule,
    ColorPickerModule,
    MatDialogModule,
    FormsModule,
  ],
  entryComponents: [
    DeleteAttributeTypeComponent,
  ]
})
export class AdminModule { }
