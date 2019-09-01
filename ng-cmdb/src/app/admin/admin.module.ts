import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { ItemTypeAttributeGroupMappingsComponent } from './item-types/attribute-group-mappings/attribute-group-mappings.component';
import { AttributeGroupItemTypeMappingsComponent } from './attribute-groups/item-type-mappings/item-type-mappings.component';
import { ConfirmDeleteMappingComponent } from './shared/confirm-delete-mapping/confirm-delete-mapping.component';
import { HelpComponent } from './help/help.component';
import { ConvertToItemTypeComponent } from './attribute-types/convert-to-item-type/convert-to-item-type.component';



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
    ItemTypeAttributeGroupMappingsComponent,
    AttributeGroupItemTypeMappingsComponent,
    ConfirmDeleteMappingComponent,
    HelpComponent,
    ConvertToItemTypeComponent,
  ],
  imports: [
    AdminRoutingModule,
    SharedModule,
    ColorPickerModule,
    FormsModule,
  ],
  entryComponents: [
    DeleteAttributeTypeComponent,
    DeleteItemTypeComponent,
    ItemTypeAttributeGroupMappingsComponent,
    AttributeGroupItemTypeMappingsComponent,
    ConfirmDeleteMappingComponent,
  ]
})
export class AdminModule { }
