import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';

import { DisplayRoutingModule } from './display-routing.module';
import { DisplayServiceModule } from './display-service.module';
import { SharedModule } from '../shared/shared.module';

import { DisplayComponent } from './display.component';
import { ResultListComponent } from './search/result-list/result-list.component';
import { ResultTableComponent } from './search/result-table/result-table.component';
import { ConfigurationItemComponent } from './configuration-item/configuration-item.component';
// import { SearchSidebarComponent } from './search/search-sidebar/search-sidebar.component';
import { DisplayItemAttributesComponent } from './configuration-item/display-item-attributes/display-item-attributes.component';
import { DisplayItemResponsibilitiesComponent} from './configuration-item/display-item-responsibilities/display-item-responsibilities.component';
import { ShowHistoryComponent } from './configuration-item/show-history/show-history.component';
import { ExportItemsComponent } from './configuration-item/export-items/export-items.component';
import { ShowGraphComponent } from './configuration-item/show-graph/show-graph.component';
import { DeleteItemComponent } from '../edit/delete-item/delete-item.component';
import { MultiSelectorComponent } from './search/multi-selector/multi-selector.component';
import { DisplayItemLinksComponent } from './configuration-item/display-item-links/display-item-links.component';
import { ResultTableNeighborComponent } from './search/result-table-neighbor/result-table-neighbor.component';
import { ItemSelectorComponent } from './search/item-selector/item-selector.component';
import { ExportItemComponent } from './configuration-item/export-item/export-item.component';
import { GraphItemComponent } from './configuration-item/show-graph/graph-item/graph-item.component';
import { ItemSharedModule } from '../shared/item-shared.module';

@NgModule({
    declarations: [
        DisplayComponent,
        ConfigurationItemComponent,
        ResultListComponent,
        ResultTableComponent,
        // SearchSidebarComponent,
        DisplayItemAttributesComponent,
        DisplayItemResponsibilitiesComponent,
        DisplayItemLinksComponent,
        MultiSelectorComponent,
        ShowHistoryComponent,
        ExportItemsComponent,
        ShowGraphComponent,
        ResultTableNeighborComponent,
        ItemSelectorComponent,
        ExportItemComponent,
        GraphItemComponent,
    ],
    imports: [
        DisplayRoutingModule,
        ItemSharedModule,
        DisplayServiceModule,
        SharedModule,
        MatSelectModule,
    ],
    entryComponents: [
        DeleteItemComponent,
        ShowHistoryComponent,
        ExportItemComponent,
        ExportItemsComponent,
    ],
})

export class DisplayModule {}
