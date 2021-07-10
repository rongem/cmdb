import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { MatSelectModule } from '@angular/material/select';

import { DisplayRoutingModule } from './display-routing.module';
import { DisplayServiceModule } from './display-service.module';
import { SharedModule } from '../shared/shared.module';

import { SearchEffects } from 'backend-access';

import { DisplayComponent } from './display.component';
import { SearchComponent } from './search/search.component';
import { ResultListComponent } from './search/result-list/result-list.component';
import { SearchFormComponent } from './search/search-form/search-form.component';
import { ResultTableComponent } from './search/result-table/result-table.component';
import { ConfigurationItemComponent } from './configuration-item/configuration-item.component';
import { SearchAttributesComponent } from './search/search-attributes/search-attributes.component';
import { SearchItemTypeComponent } from './search/search-item-type/search-item-type.component';
import { SearchConnectionsDownwardComponent } from './search/search-connections-downward/search-connections-downward.component';
import { SearchConnectionsUpwardComponent } from './search/search-connections-upward/search-connections-upward.component';
import { SearchNameValueComponent } from './search/search-name-value/search-name-value.component';
import { SearchResponsibilityComponent } from './search/search-responsibility/search-responsibility.component';
import { SearchConnectionComponent } from './search/search-connection/search-connection.component';
import { SearchSidebarComponent } from './search/search-sidebar/search-sidebar.component';
import { DisplayItemAttributesComponent } from './configuration-item/display-item-attributes/display-item-attributes.component';
import { DisplayItemResponsibilitiesComponent} from './configuration-item/display-item-responsibilities/display-item-responsibilities.component';
import { CopyItemComponent } from './configuration-item/copy-item/copy-item.component';
import { CreateItemComponent } from './configuration-item/create-item/create-item.component';
import { ImportItemsComponent } from './configuration-item/import-items/import-items.component';
import { SearchNeighborComponent } from './search/search-neighbor/search-neighbor.component';
import { SearchFormDirective } from './search/search-form.directive';
import { ShowHistoryComponent } from './configuration-item/show-history/show-history.component';
import { ExportItemsComponent } from './configuration-item/export-items/export-items.component';
import { ShowGraphComponent } from './configuration-item/show-graph/show-graph.component';
import { DeleteItemComponent } from './configuration-item/delete-item/delete-item.component';
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
        SearchComponent,
        ConfigurationItemComponent,
        ResultListComponent,
        SearchFormComponent,
        ResultTableComponent,
        SearchAttributesComponent,
        SearchItemTypeComponent,
        SearchConnectionComponent,
        SearchConnectionsDownwardComponent,
        SearchConnectionsUpwardComponent,
        SearchNameValueComponent,
        SearchResponsibilityComponent,
        SearchSidebarComponent,
        DisplayItemAttributesComponent,
        DisplayItemResponsibilitiesComponent,
        DisplayItemLinksComponent,
        MultiSelectorComponent,
        CopyItemComponent,
        CreateItemComponent,
        ImportItemsComponent,
        SearchNeighborComponent,
        ShowHistoryComponent,
        ExportItemsComponent,
        ShowGraphComponent,
        DeleteItemComponent,
        SearchFormDirective,
        ResultTableNeighborComponent,
        ItemSelectorComponent,
        ExportItemComponent,
        GraphItemComponent,
    ],
    imports: [
        DisplayRoutingModule,
        EffectsModule.forFeature([ SearchEffects]),
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
