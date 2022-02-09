import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { ValidatorModule } from 'backend-access';
import { ItemSharedModule } from '../shared/item-shared.module';
import { CoreModule } from '../shared/core.module';
import { MultiAddConnectionsComponent } from './multi-add-connections/multi-add-connections.component';
import { MultiAddLinksComponent } from './multi-add-links/multi-add-links.component';
import { MultiDeleteConnectionsComponent } from './multi-delete-connections/multi-delete-connections.component';
import { MultiDeleteLinksComponent } from './multi-delete-links/multi-delete-links.component';
import { MultiEditRoutingModule } from './multi-edit-routing.module';
import { MultiEditServiceModule } from './multi-edit-service.module';
import { MultiEditComponent } from './multi-edit.component';
import { MultiResultsComponent } from './multi-results/multi-results.component';
import { MultiWorkingComponent } from './multi-working/multi-working.component';


@NgModule({
    declarations: [
        MultiEditComponent,
        MultiAddConnectionsComponent,
        MultiDeleteConnectionsComponent,
        MultiAddLinksComponent,
        MultiDeleteLinksComponent,
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
