import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisplayComponent } from './display.component';
import { ConfigurationItemComponent } from './configuration-item/configuration-item.component';
import { ResultTableComponent } from './search/result-table/result-table.component';

const displayRoutes: Routes = [
    {
        path: 'display', component: DisplayComponent, children: [
            {
                path: 'configuration-item', children: [
                    { path: '', pathMatch: 'full', redirectTo: 'new' },
                    { path: 'results', component: ResultTableComponent },
                    { path: 'new', component: ConfigurationItemComponent, canActivate: [] },
                    { path: ':id/edit', component: ConfigurationItemComponent, canActivate: []},
                    { path: ':id', component: ConfigurationItemComponent },
                ]
            }
        ],
    },
];

@NgModule({
    imports: [ RouterModule.forChild(displayRoutes) ],
    exports: [ RouterModule ]
})

export class DisplayRoutingModule {}
