import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { CoreModule } from '../shared/core.module';

import { ItemSharedModule } from '../shared/item-shared.module';
import { ConfigurationItemComponent } from './configuration-item/configuration-item.component';
import {
    DisplayItemAttributesComponent,
} from './configuration-item/display-item-attributes/display-item-attributes.component';
import { DisplayItemLinksComponent } from '../shared/display-item-links/display-item-links.component';
import {
    DisplayItemResponsibilitiesComponent,
} from './configuration-item/display-item-responsibilities/display-item-responsibilities.component';
import { GraphItemComponent } from './configuration-item/show-graph/graph-item/graph-item.component';
import { ShowGraphComponent } from './configuration-item/show-graph/show-graph.component';
import { DisplayRoutingModule } from './display-routing.module';
import { DisplayServiceModule } from './display-service.module';
import { DisplayComponent } from './display.component';
import { ItemSelectorComponent } from './search/item-selector/item-selector.component';
import { MultiSelectorComponent } from './search/multi-selector/multi-selector.component';
import { ResultListComponent } from './search/result-list/result-list.component';
import { ResultTableNeighborComponent } from './search/result-table-neighbor/result-table-neighbor.component';
import { ResultTableComponent } from './search/result-table/result-table.component';
import { SearchSidebarComponent } from './search/search-sidebar/search-sidebar.component';

@NgModule({
    declarations: [
        DisplayComponent,
        ConfigurationItemComponent,
        ResultListComponent,
        ResultTableComponent,
        SearchSidebarComponent,
        DisplayItemAttributesComponent,
        DisplayItemResponsibilitiesComponent,
        DisplayItemLinksComponent,
        MultiSelectorComponent,
        ShowGraphComponent,
        ResultTableNeighborComponent,
        ItemSelectorComponent,
        GraphItemComponent,
    ],
    imports: [
        ClipboardModule,
        CommonModule,
        FormsModule,
        DisplayRoutingModule,
        CoreModule,
        ItemSharedModule,
        DisplayServiceModule,
        MatDialogModule,
        MatMenuModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatTableModule,
    ],
})

export class DisplayModule {}
