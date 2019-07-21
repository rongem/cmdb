import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { AttributeGroupsComponent } from './attribute-groups/attribute-groups.component';
import { AttributeTypesComponent } from './attribute-types/attribute-types.component';
import { ConnectionTypesComponent } from './connection-types/connection-types.component';
import { ItemTypesComponent } from './item-types/item-types.component';
import { ConnectionRulesComponent } from './connection-rules/connection-rules.component';
import { UsersComponent } from './users/users.component';

const adminRoutes: Routes = [
    {
        path: 'admin', component: AdminComponent, children: [
            {
                path: 'attribute-groups', children: [
                    { path: '', pathMatch: 'full', component: AttributeGroupsComponent },
                    { path: ':id', component: AttributeGroupsComponent },
                ]
            },
            {
                path: 'attribute-types', children: [
                    { path: '', pathMatch: 'full', component: AttributeTypesComponent },
                    { path: ':id', component: AttributeTypesComponent },
                ]
            },
            {
                path: 'connection-types', children: [
                    { path: '', pathMatch: 'full', component: ConnectionTypesComponent },
                    { path: ':id', component: ConnectionTypesComponent },
                ]
            },
            {
                path: 'item-types', children: [
                    { path: '', pathMatch: 'full', component: ItemTypesComponent },
                    { path: ':id', component: ItemTypesComponent },
                ]
            },
            {
                path: 'connection-rules', children: [
                    { path: '', pathMatch: 'full', component: ConnectionRulesComponent },
                    { path: ':id', component: ConnectionRulesComponent },
                ]
            },
            {
                path: 'users', children: [
                    { path: '', pathMatch: 'full', component: UsersComponent },
                    { path: ':id', component: UsersComponent },
                ]
            },
        ]
    }
];

@NgModule({
    imports: [ RouterModule.forChild(adminRoutes) ],
    exports: [ RouterModule ]
})
export class AdminRoutingModule {}
