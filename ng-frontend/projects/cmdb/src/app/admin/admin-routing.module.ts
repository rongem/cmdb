import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { AttributeGroupsComponent } from './attribute-groups/attribute-groups.component';
import { AttributeTypesComponent } from './attribute-types/attribute-types.component';
import { ConvertToItemTypeComponent } from './attribute-types/convert-to-item-type/convert-to-item-type.component';
import { ConnectionTypesComponent } from './connection-types/connection-types.component';
import { ItemTypesComponent } from './item-types/item-types.component';
import { ConnectionRulesComponent } from './connection-rules/connection-rules.component';
import { UsersComponent } from './users/users.component';
import { AttributeGroupItemTypeMappingsComponent } from './attribute-groups/item-type-mappings/item-type-mappings.component';
import { ItemTypeAttributeGroupMappingsComponent } from './item-types/attribute-group-mappings/attribute-group-mappings.component';
import { DeleteAttributeTypeComponent } from './attribute-types/delete-attribute-type/delete-attribute-type.component';
import { EditRuleComponent } from './connection-rules/edit-rule/edit-rule.component';
import { DeleteItemTypeComponent } from './item-types/delete-item-type/delete-item-type.component';
import { NewUserComponent } from './users/new-user/new-user.component';

const adminRoutes: Routes = [
    {
        path: '', component: AdminComponent, children: [
            { path: '', pathMatch: 'full', redirectTo: 'attribute-groups' },
            { path: 'attribute-groups', component: AttributeGroupsComponent },
            { path: 'attribute-group/:id', component: AttributeGroupItemTypeMappingsComponent },
            { path: 'attribute-types/convert/:id', component: ConvertToItemTypeComponent },
            { path: 'attribute-types/delete/:id', component: DeleteAttributeTypeComponent },
            { path: 'attribute-types', component: AttributeTypesComponent },
            { path: 'connection-types', component: ConnectionTypesComponent },
            { path: 'item-types/delete/:id', component: DeleteItemTypeComponent },
            { path: 'item-types', component: ItemTypesComponent },
            { path: 'item-type/:id', component: ItemTypeAttributeGroupMappingsComponent },
            { path: 'connection-rules', component: ConnectionRulesComponent },
            { path: 'connection-rule/:id', component: EditRuleComponent },
            { path: 'users/new', component: NewUserComponent },
            { path: 'users', component: UsersComponent },
        ]
    }
];

@NgModule({
    imports: [ RouterModule.forChild(adminRoutes) ],
    exports: [ RouterModule ]
})
export class AdminRoutingModule {}
