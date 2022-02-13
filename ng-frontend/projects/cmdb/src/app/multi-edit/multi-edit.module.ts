import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { ValidatorModule } from 'backend-access';
import { ItemSharedModule } from '../shared/item-shared.module';
import { CoreModule } from '../shared/core.module';
import { MultiAddLinksComponent } from './multi-add-links/multi-add-links.component';
import { MultiEditRoutingModule } from './multi-edit-routing.module';
import { MultiEditServiceModule } from './multi-edit-service.module';
import { MultiEditComponent } from './multi-edit.component';
import { MultiResultsComponent } from './multi-results/multi-results.component';
import { MultiWorkingComponent } from './multi-working/multi-working.component';


@NgModule({
    declarations: [
        MultiEditComponent,
        MultiAddLinksComponent,
        MultiResultsComponent,
        MultiWorkingComponent,
    ],
    imports: [
        CommonModule,
        CoreModule,
        ReactiveFormsModule,
        MultiEditRoutingModule,
        MultiEditServiceModule,
        ItemSharedModule,
        MatTableModule,
        ValidatorModule,
    ]
})
export class MultiEditModule {}
