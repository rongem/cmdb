import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { DisplayRoutingModule } from './display-routing.module';
import { DisplayComponent } from './display.component';
import { SearchService } from './search/search.service';
import { SearchComponent } from './search/search.component';
import { ResultListComponent } from './search/result-list/result-list.component';
import { SharedModule } from '../shared/shared.module';
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
import { SearchSidebarComponent } from './search/search-sidebar/search-sidebar.component';

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
    ],
    imports: [
        DisplayRoutingModule,
        SharedModule,
        EffectsModule.forFeature([DisplayEffects])
    ],
    providers: [
        SearchService,
    ],
})

export class DisplayModule {}
