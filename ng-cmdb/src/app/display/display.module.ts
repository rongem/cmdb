import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { DisplayRoutingModule } from './display-routing.module';
import { MatTabsModule } from '@angular/material/tabs';

import { DisplayComponent } from './display.component';
import { SearchComponent } from './search/search.component';
import { ResultListComponent } from './search/result-list/result-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
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
import { DisplayEffects } from './store/display.effects';
import { EditEffects } from './store/edit.effects';
import { SearchSidebarComponent } from './search/search-sidebar/search-sidebar.component';
import { EditItemComponent } from './configuration-item/edit-item/edit-item.component';
import { DisplayItemAttributesComponent } from './configuration-item/display-item-attributes/display-item-attributes.component';
import { DisplayItemResponsibilitiesComponent } from './configuration-item/display-item-responsibilities/display-item-responsibilities.component';
import { CopyItemComponent } from './configuration-item/copy-item/copy-item.component';
import { CreateItemComponent } from './configuration-item/create-item/create-item.component';
import { ImportItemsComponent } from './configuration-item/import-items/import-items.component';
import { SearchNeighborComponent } from './configuration-item/search-neighbor/search-neighbor.component';
import { ShowHistoryComponent } from './configuration-item/show-history/show-history.component';
import { ExportItemsComponent } from './configuration-item/export-items/export-items.component';
import { ShowGraphComponent } from './configuration-item/show-graph/show-graph.component';
import { ItemMenuComponent } from './configuration-item/item-menu/item-menu.component';
import { AddLinkComponent } from './configuration-item/edit-item/add-link/add-link.component';

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
        EditItemComponent,
        DisplayItemAttributesComponent,
        DisplayItemResponsibilitiesComponent,
        CopyItemComponent,
        CreateItemComponent,
        ImportItemsComponent,
        SearchNeighborComponent,
        ShowHistoryComponent,
        ExportItemsComponent,
        ShowGraphComponent,
        ItemMenuComponent,
        AddLinkComponent,
    ],
    imports: [
        DisplayRoutingModule,
        SharedModule,
        EffectsModule.forFeature([DisplayEffects, EditEffects]),
        MatTabsModule,
    ],
    entryComponents: [
        AddLinkComponent,
    ]
})

export class DisplayModule {}
