import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EffectsModule } from '@ngrx/effects';
import { AdminEffects, ValidatorModule } from 'backend-access';

import { CoreModule } from '../shared/core.module';
import { AdminNavbarComponent } from './admin-navbar/admin-navbar.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AttributeGroupsComponent } from './attribute-groups/attribute-groups.component';
import { AttributeGroupItemTypeMappingsComponent } from './attribute-groups/item-type-mappings/item-type-mappings.component';
import { AttributeTypesComponent } from './attribute-types/attribute-types.component';
import { ConvertToItemTypeComponent } from './attribute-types/convert-to-item-type/convert-to-item-type.component';
import { DeleteAttributeTypeComponent } from './attribute-types/delete-attribute-type/delete-attribute-type.component';
import { ConnectionRulesComponent } from './connection-rules/connection-rules.component';
import { EditRuleComponent } from './connection-rules/edit-rule/edit-rule.component';
import { ConnectionTypesComponent } from './connection-types/connection-types.component';
import { HelpComponent } from './help/help.component';
import {
  ItemTypeAttributeGroupMappingsComponent,
} from './item-types/attribute-group-mappings/attribute-group-mappings.component';
import { DeleteItemTypeComponent } from './item-types/delete-item-type/delete-item-type.component';
import { ItemTypesComponent } from './item-types/item-types.component';
import { ColorPaletteComponent } from './shared/color-picker/color-palette/color-palette.component';
import { ColorPickerComponent } from './shared/color-picker/color-picker.component';
import { ColorSliderComponent } from './shared/color-picker/color-slider/color-slider.component';
import { ConfirmDeleteMappingComponent } from './shared/confirm-delete-mapping/confirm-delete-mapping.component';
import { NewUserComponent } from './users/new-user/new-user.component';
import { UsersComponent } from './users/users.component';

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
    NewUserComponent,
  ],
  imports: [
    AdminRoutingModule,
    CoreModule,
    ClipboardModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatInputModule,
    ValidatorModule,
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
