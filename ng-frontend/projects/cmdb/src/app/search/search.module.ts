import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EffectsModule } from '@ngrx/effects';
import { SearchEffects } from 'backend-access';
import { CoreModule } from '../shared/core.module';
import { ItemSharedModule } from '../shared/item-shared.module';
import { SearchAttributesComponent } from './search-attributes/search-attributes.component';
import { SearchConnectionComponent } from './search-connection/search-connection.component';
import { SearchConnectionsDownwardComponent } from './search-connections-downward/search-connections-downward.component';
import { SearchConnectionsUpwardComponent } from './search-connections-upward/search-connections-upward.component';
import { SearchFormDirective } from './search-form.directive';
import { SearchFormComponent } from './search-form/search-form.component';
import { SearchItemTypeComponent } from './search-item-type/search-item-type.component';
import { SearchNameValueComponent } from './search-name-value/search-name-value.component';
import { SearchNeighborComponent } from './search-neighbor/search-neighbor.component';
import { SearchResponsibilityComponent } from './search-responsibility/search-responsibility.component';
import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';

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
        CommonModule,
        ReactiveFormsModule,
        SearchRoutingModule,
        CoreModule,
        ItemSharedModule,
        EffectsModule.forFeature([ SearchEffects ]),
        MatAutocompleteModule,
        MatInputModule,
        MatMenuModule,
        MatSlideToggleModule,
        MatTooltipModule,
    ]
})
export class SearchModule {}
