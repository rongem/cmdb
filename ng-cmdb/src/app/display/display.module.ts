import { NgModule } from '@angular/core';
// import { ReactiveFormsModule } from '@angular/forms';

import { DisplayRoutingModule } from './display-routing.module';
import { DisplayComponent } from './display.component';
import { SearchService } from './search/search.service';
import { SearchComponent } from './search/search.component';
import { ResultListComponent } from './search/result-list/result-list.component';
import { SharedModule } from '../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SearchFormComponent } from './search/search-form/search-form.component';
import { ResultTableComponent } from './search/result-table/result-table.component';
import { ConfigurationItemComponent } from './configuration-item/configuration-item.component';

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
    ],
})

export class DisplayModule {}
