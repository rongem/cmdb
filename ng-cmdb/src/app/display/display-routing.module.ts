import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisplayAuthGuard } from './display-auth.guard';
import { DisplayComponent } from './display.component';
import { ConfigurationItemComponent } from './configuration-item/configuration-item.component';
import { ResultTableComponent } from './search/result-table/result-table.component';
import { SearchComponent } from './search/search.component';
import { EditItemComponent } from './configuration-item/edit-item/edit-item.component';
import { CreateItemComponent } from './configuration-item/create-item/create-item.component';
import { CopyItemComponent } from './configuration-item/copy-item/copy-item.component';
import { SearchNeighborComponent } from './search/search-neighbor/search-neighbor.component';

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
                    { path: '', pathMatch: 'full', redirectTo: '/display/search' },
                    { path: 'create', component: CreateItemComponent, canActivate: [DisplayAuthGuard] },
                    { path: ':id/edit', component: EditItemComponent, canActivate: [DisplayAuthGuard]},
                    { path: ':id/copy', component: CopyItemComponent, canActivate: [DisplayAuthGuard]},
                    { path: ':id/search', component: SearchNeighborComponent},
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
