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
import { ResultTableNeighborComponent } from './search/result-table-neighbor/result-table-neighbor.component';
import { ImportItemsComponent } from './configuration-item/import-items/import-items.component';
import { ExportItemsComponent } from './configuration-item/export-items/export-items.component';
import { ShowGraphComponent } from './configuration-item/show-graph/show-graph.component';
import { MultiEditGuard } from './multi-edit/multi-edit.guard';

const displayRoutes: Routes = [
    {
        path: '', component: DisplayComponent, children: [
            {
                path: '', pathMatch: 'full', redirectTo: 'search'
            },
            { path: 'search', component: SearchComponent },
            { path: 'results', component: ResultTableComponent },
            { path: 'multi-edit', canActivate: [MultiEditGuard], loadChildren: () => import('./multi-edit/multi-edit.module').then(m => m.MultiEditModule) },
            { path: 'import', component: ImportItemsComponent },
            { path: 'export', component: ExportItemsComponent },
            {
                path: 'configuration-item', children: [
                    { path: '', pathMatch: 'full', redirectTo: '/display/search' },
                    { path: 'create', component: CreateItemComponent, canActivate: [DisplayAuthGuard] },
                    { path: ':id/edit', component: EditItemComponent, canActivate: [DisplayAuthGuard] },
                    { path: ':id/copy', component: CopyItemComponent, canActivate: [DisplayAuthGuard] },
                    { path: ':id/search', component: SearchNeighborComponent },
                    { path: ':id/neighbors', component: ResultTableNeighborComponent },
                    { path: ':id/graph', component: ShowGraphComponent },
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
