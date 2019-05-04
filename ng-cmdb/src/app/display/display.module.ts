import { NgModule } from '@angular/core';
// import { ReactiveFormsModule } from '@angular/forms';

import { DisplayRoutingModule } from './display-routing.module';
import { DisplayComponent } from './display.component';
import { SearchService } from './search/search.service';
import { SearchComponent } from './search/search.component';
import { ResultListComponent } from './search/result-list/result-list.component';
import { SharedModule } from '../shared/shared.module';
import { MatIconModule, MatTooltipModule } from '@angular/material';
import { SearchFormComponent } from './search/search-form/search-form.component';
import { ResultTableComponent } from './search/result-table/result-table.component';
import { ConfigurationItemComponent } from './configuration-item/configuration-item.component';
import { ConfigurationItemService } from './configuration-item.service';

@NgModule({
    declarations: [
        DisplayComponent,
        SearchComponent,
        ConfigurationItemComponent,
        ResultListComponent,
        SearchFormComponent,
        ResultTableComponent,
    ],
    imports: [
        DisplayRoutingModule,
        SharedModule,
        MatIconModule,
        MatTooltipModule,
    ],
    providers: [
        SearchService,
        ConfigurationItemService
    ],
})

export class DisplayModule {}
