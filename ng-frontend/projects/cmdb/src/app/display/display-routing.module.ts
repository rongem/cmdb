import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditAuthGuard } from '../shared/edit-auth.guard';
import { DisplayComponent } from './display.component';
import { ConfigurationItemComponent } from './configuration-item/configuration-item.component';
import { ResultTableComponent } from './search/result-table/result-table.component';
import { EditItemComponent } from '../edit/edit-item/edit-item.component';
import { CreateItemComponent } from './configuration-item/create-item/create-item.component';
import { CopyItemComponent } from './configuration-item/copy-item/copy-item.component';
import { ResultTableNeighborComponent } from './search/result-table-neighbor/result-table-neighbor.component';
import { ImportItemsComponent } from './configuration-item/import-items/import-items.component';
import { ExportItemsComponent } from './configuration-item/export-items/export-items.component';
import { ShowGraphComponent } from './configuration-item/show-graph/show-graph.component';

const displayRoutes: Routes = [
    {
        path: '', component: DisplayComponent, children: [
            {
                path: '', pathMatch: 'full', redirectTo: '/search'
            },
            { path: 'results', component: ResultTableComponent },
            { path: 'import', component: ImportItemsComponent },
            { path: 'export', component: ExportItemsComponent },
            {
                path: 'configuration-item', children: [
                    { path: '', pathMatch: 'full', redirectTo: '/display/search' },
                    { path: 'create', component: CreateItemComponent, canActivate: [EditAuthGuard] },
                    { path: ':id/edit', component: EditItemComponent, canActivate: [EditAuthGuard] },
                    { path: ':id/copy', component: CopyItemComponent, canActivate: [EditAuthGuard] },
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
