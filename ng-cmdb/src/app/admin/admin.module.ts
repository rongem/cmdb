import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
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
import { DeleteItemTypeComponent } from './item-types/delete-item-type/delete-item-type.component';
import { DeleteConnectionTypeComponent } from './connection-types/delete-connection-type/delete-connection-type.component';
import { ItemTypeAttributeGroupMappingsComponent } from './item-types/attribute-group-mappings/attribute-group-mappings.component';
import { AttributeGroupItemTypeMappingsComponent } from './attribute-groups/item-type-mappings/item-type-mappings.component';
import { ConfirmDeleteMappingComponent } from './shared/confirm-delete-mapping/confirm-delete-mapping.component';



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
    DeleteItemTypeComponent,
    DeleteConnectionTypeComponent,
    ItemTypeAttributeGroupMappingsComponent,
    AttributeGroupItemTypeMappingsComponent,
    ConfirmDeleteMappingComponent,
  ],
  imports: [
    AdminRoutingModule,
    CommonModule,
    SharedModule,
    MatIconModule,
    MatTooltipModule,
    ColorPickerModule,
    MatDialogModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatListModule,
    MatSlideToggleModule,
    FormsModule,
  ],
  entryComponents: [
    DeleteAttributeTypeComponent,
    DeleteConnectionTypeComponent,
    DeleteItemTypeComponent,
    ItemTypeAttributeGroupMappingsComponent,
    AttributeGroupItemTypeMappingsComponent,
    ConfirmDeleteMappingComponent,
  ]
})
export class AdminModule { }
