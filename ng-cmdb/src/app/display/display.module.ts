import { NgModule } from '@angular/core';
// import { ReactiveFormsModule } from '@angular/forms';

import { DisplayRoutingModule } from './display-routing.module';
import { DisplayComponent } from './display.component';
import { SearchService } from './search/search.service';
import { SearchComponent } from './search/search.component';
import { ResultListComponent } from './search/result-list/result-list.component';
import { SharedModule } from '../shared/shared.module';
import { MatIconModule } from '@angular/material';

@NgModule({
    declarations: [
        DisplayComponent,
        SearchComponent,
        ResultListComponent,
    ],
    imports: [
        DisplayRoutingModule,
        SharedModule,
        MatIconModule,
    ],
    providers: [
        SearchService
    ],
})

export class DisplayModule {}
