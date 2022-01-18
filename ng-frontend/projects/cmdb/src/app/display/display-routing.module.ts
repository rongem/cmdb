import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationItemComponent } from './configuration-item/configuration-item.component';
import { ResultTableComponent } from './search/result-table/result-table.component';
import { ResultTableNeighborComponent } from './search/result-table-neighbor/result-table-neighbor.component';
import { ExportItemsComponent } from '../shared/export-items/export-items.component';
import { ShowGraphComponent } from './show-graph/show-graph.component';
import { DisplayComponent } from './display.component';
import { ItemContainerComponent } from './item-container/item-container.component';
import { ShowHistoryComponent } from '../shared/show-history/show-history.component';

const displayRoutes: Routes = [
    { path: '', pathMatch: 'full', component: DisplayComponent },
    { path: 'item-type/:id', component: DisplayComponent },
    { path: 'results', component: ResultTableComponent },
    { path: 'export', component: ExportItemsComponent },
    { path: 'configuration-item', component: ItemContainerComponent, children: [
        { path: '', pathMatch: 'full', redirectTo: '/display'},
        { path: ':id/neighbors', component: ResultTableNeighborComponent },
        { path: ':id/graph', component: ShowGraphComponent },
        { path: ':id/history', component: ShowHistoryComponent },
        { path: ':id', component: ConfigurationItemComponent },
    ]},
];

@NgModule({
    imports: [ RouterModule.forChild(displayRoutes) ],
    exports: [ RouterModule ]
})

export class DisplayRoutingModule {}
