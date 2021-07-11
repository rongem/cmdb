import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { SearchEffects } from 'backend-access';
import { SharedModule } from '../shared/shared.module';
import { ItemSharedModule } from '../shared/item-shared.module';
import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { SearchAttributesComponent } from './search-attributes/search-attributes.component';
import { SearchItemTypeComponent } from './search-item-type/search-item-type.component';
import { SearchConnectionsDownwardComponent } from './search-connections-downward/search-connections-downward.component';
import { SearchConnectionsUpwardComponent } from './search-connections-upward/search-connections-upward.component';
import { SearchNameValueComponent } from './search-name-value/search-name-value.component';
import { SearchResponsibilityComponent } from './search-responsibility/search-responsibility.component';
import { SearchConnectionComponent } from './search-connection/search-connection.component';
import { SearchNeighborComponent } from './search-neighbor/search-neighbor.component';
import { SearchFormDirective } from './search-form.directive';

@NgModule({
    declarations: [
        SearchComponent,
        SearchAttributesComponent,
        SearchItemTypeComponent,
        SearchConnectionComponent,
        SearchConnectionsDownwardComponent,
        SearchConnectionsUpwardComponent,
        SearchNameValueComponent,
        SearchResponsibilityComponent,
        SearchFormDirective,
        SearchFormComponent,
        SearchNeighborComponent,
    ],
    imports: [
        SearchRoutingModule,
        SharedModule,
        ItemSharedModule,
        EffectsModule.forFeature([ SearchEffects]),
    ]
})
export class SearchModule {}
