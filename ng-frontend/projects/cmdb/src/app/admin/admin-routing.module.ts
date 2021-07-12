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

const adminRoutes: Routes = [
    {
        path: '', component: AdminComponent, children: [
            { path: 'attribute-groups', component: AttributeGroupsComponent },
            { path: 'attribute-types/convert/:id', component: ConvertToItemTypeComponent },
            { path: 'attribute-types', component: AttributeTypesComponent },
            { path: 'connection-types', component: ConnectionTypesComponent },
            { path: 'item-types', component: ItemTypesComponent },
            { path: 'connection-rules', component: ConnectionRulesComponent },
            { path: 'users', component: UsersComponent },
        ]
    }
];

@NgModule({
    imports: [ RouterModule.forChild(adminRoutes) ],
    exports: [ RouterModule ]
})
export class AdminRoutingModule {}
