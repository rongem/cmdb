import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { AdminEffects } from 'backend-access';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminServiceModule } from './admin-services.module';
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
import { ColorPickerComponent } from './shared/color-picker/color-picker.component';
import { ColorSliderComponent } from './shared/color-picker/color-slider/color-slider.component';
import { ColorPaletteComponent } from './shared/color-picker/color-palette/color-palette.component';
import { EditRuleComponent } from './connection-rules/edit-rule/edit-rule.component';

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
    ColorPickerComponent,
    ColorSliderComponent,
    ColorPaletteComponent,
    EditRuleComponent,
  ],
  imports: [
    AdminRoutingModule,
    AdminServiceModule,
    SharedModule,
    EffectsModule.forFeature([AdminEffects])
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
