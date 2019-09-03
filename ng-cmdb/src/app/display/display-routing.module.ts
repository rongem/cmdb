import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisplayComponent } from './display.component';
import { ConfigurationItemComponent } from './configuration-item/configuration-item.component';
import { ResultTableComponent } from './search/result-table/result-table.component';
import { SearchComponent } from './search/search.component';

const displayRoutes: Routes = [
    {
        path: '', component: DisplayComponent, children: [
            {
                path: '', pathMatch: 'full', redirectTo: 'search'
            },
            { path: 'search', component: SearchComponent },
            { path: 'results', component: ResultTableComponent },
            {
                path: 'configuration-item', children: [
                    { path: '', pathMatch: 'full', redirectTo: '../search' },
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
