import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisplayComponent } from './display.component';
import { ConfigurationItemComponent } from './configuration-item/configuration-item.component';
import { ResultTableComponent } from './search/result-table/result-table.component';
import { ResultTableNeighborComponent } from './search/result-table-neighbor/result-table-neighbor.component';
import { ExportItemsComponent } from '../shared/export-items/export-items.component';
import { ShowGraphComponent } from './configuration-item/show-graph/show-graph.component';

const displayRoutes: Routes = [
    {
        path: '', component: DisplayComponent, children: [
            { path: '', pathMatch: 'full', redirectTo: '/search' },
            { path: 'results', component: ResultTableComponent },
            { path: 'export', component: ExportItemsComponent },
            { path: 'configuration-item/:id/neighbors', component: ResultTableNeighborComponent },
            { path: 'configuration-item/:id/graph', component: ShowGraphComponent },
            { path: 'configuration-item/:id', component: ConfigurationItemComponent },
        ],
    },
];

@NgModule({
    imports: [ RouterModule.forChild(displayRoutes) ],
    exports: [ RouterModule ]
})

export class DisplayRoutingModule {}
