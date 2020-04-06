import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { MatSelectModule } from '@angular/material/select';

import { DisplayRoutingModule } from './display-routing.module';
import { DisplayServiceModule } from './display-service.module';
import { SharedModule } from 'projects/cmdb/src/app/shared/shared.module';

import { DisplayEffects } from './store/display.effects';
import { SearchEffects } from './store/search.effects';
import { EditEffects } from './store/edit.effects';
import { RouterEffects } from './store/router.effects';
import { MultiEditEffects } from './store/multi-edit.effects';

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
import { EditItemComponent } from './configuration-item/edit-item/edit-item.component';
import { DisplayItemAttributesComponent } from './configuration-item/display-item-attributes/display-item-attributes.component';
import { DisplayItemResponsibilitiesComponent
    } from './configuration-item/display-item-responsibilities/display-item-responsibilities.component';
import { CopyItemComponent } from './configuration-item/copy-item/copy-item.component';
import { CreateItemComponent } from './configuration-item/create-item/create-item.component';
import { ImportItemsComponent } from './configuration-item/import-items/import-items.component';
import { SearchNeighborComponent } from './search/search-neighbor/search-neighbor.component';
import { SearchFormDirective } from './search/search-form.directive';
import { ShowHistoryComponent } from './configuration-item/show-history/show-history.component';
import { ExportItemsComponent } from './configuration-item/export-items/export-items.component';
import { ShowGraphComponent } from './configuration-item/show-graph/show-graph.component';
import { ItemMenuComponent } from './configuration-item/item-menu/item-menu.component';
import { AddLinkComponent } from './configuration-item/edit-item-links/add-link/add-link.component';
import { EditItemResponsibilitiesComponent } from './configuration-item/edit-item-responsibilities/edit-item-responsibilities.component';
import { EditItemAttributesComponent } from './configuration-item/edit-item-attributes/edit-item-attributes.component';
import { EditItemLinksComponent } from './configuration-item/edit-item-links/edit-item-links.component';
import { EditItemConnectionsComponent } from './configuration-item/edit-item-connections/edit-item-connections.component';
import { AddConnectionComponent } from './configuration-item/edit-item-connections/add-connection/add-connection.component';
import { DeleteItemComponent } from './configuration-item/delete-item/delete-item.component';
import { DisplayItemLinksComponent } from './configuration-item/display-item-links/display-item-links.component';
import { ResultTableNeighborComponent } from './search/result-table-neighbor/result-table-neighbor.component';
import { MultiEditComponent } from './multi-edit/multi-edit.component';
import { MultiSelectorComponent } from './search/multi-selector/multi-selector.component';
import { ItemSelectorComponent } from './search/item-selector/item-selector.component';
import { MultiTableComponent } from './multi-edit/multi-table/multi-table.component';
import { MultiAttributesComponent } from './multi-edit/multi-attributes/multi-attributes.component';
import { MultiAddConnectionsComponent } from './multi-edit/multi-add-connections/multi-add-connections.component';
import { MultiDeleteConnectionsComponent } from './multi-edit/multi-delete-connections/multi-delete-connections.component';
import { MultiAddLinksComponent } from './multi-edit/multi-add-links/multi-add-links.component';
import { MultiDeleteLinksComponent } from './multi-edit/multi-delete-links/multi-delete-links.component';
import { MultiResultsDialogComponent } from './multi-edit/multi-results-dialog/multi-results-dialog.component';
import { ExportItemComponent } from './configuration-item/export-item/export-item.component';
import { GraphItemComponent } from './configuration-item/show-graph/graph-item/graph-item.component';

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
        DisplayItemLinksComponent,
        CopyItemComponent,
        CreateItemComponent,
        ImportItemsComponent,
        SearchNeighborComponent,
        ShowHistoryComponent,
        ExportItemsComponent,
        ShowGraphComponent,
        ItemMenuComponent,
        AddLinkComponent,
        EditItemResponsibilitiesComponent,
        EditItemAttributesComponent,
        EditItemLinksComponent,
        EditItemConnectionsComponent,
        AddConnectionComponent,
        DeleteItemComponent,
        SearchFormDirective,
        ResultTableNeighborComponent,
        MultiEditComponent,
        MultiSelectorComponent,
        ItemSelectorComponent,
        MultiTableComponent,
        MultiAttributesComponent,
        MultiAddConnectionsComponent,
        MultiDeleteConnectionsComponent,
        MultiAddLinksComponent,
        MultiDeleteLinksComponent,
        MultiResultsDialogComponent,
        ExportItemComponent,
        GraphItemComponent,
    ],
    imports: [
        DisplayRoutingModule,
        DisplayServiceModule,
        SharedModule,
        EffectsModule.forFeature([DisplayEffects, SearchEffects, EditEffects, RouterEffects, MultiEditEffects]),
        MatSelectModule,
    ],
    entryComponents: [
        AddLinkComponent,
        AddConnectionComponent,
        DeleteItemComponent,
        ShowHistoryComponent,
        MultiResultsDialogComponent,
        ExportItemComponent,
        ExportItemsComponent,
    ],
})

export class DisplayModule {}
