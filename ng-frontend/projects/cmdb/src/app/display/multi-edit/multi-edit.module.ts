import { NgModule } from '@angular/core';

import { MultiEditRoutingModule } from './multi-edit-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { DisplaySharedModule } from '../display-shared-module';
import { MultiEditServiceModule } from './multi-edit-service.module';
import { MultiEditComponent } from './multi-edit.component';
import { MultiTableComponent } from './multi-table/multi-table.component';
import { MultiAttributesComponent } from './multi-attributes/multi-attributes.component';
import { MultiAddConnectionsComponent } from './multi-add-connections/multi-add-connections.component';
import { MultiDeleteConnectionsComponent } from './multi-delete-connections/multi-delete-connections.component';
import { MultiAddLinksComponent } from './multi-add-links/multi-add-links.component';
import { MultiDeleteLinksComponent } from './multi-delete-links/multi-delete-links.component';
import { MultiResultsComponent } from './multi-results/multi-results.component';
import { MultiWorkingComponent } from './multi-working/multi-working.component';

@NgModule({
    declarations: [
        MultiEditComponent,
        MultiTableComponent,
        MultiAttributesComponent,
        MultiAddConnectionsComponent,
        MultiDeleteConnectionsComponent,
        MultiAddLinksComponent,
        MultiDeleteLinksComponent,
        MultiResultsComponent,
        MultiWorkingComponent,
    ],
    imports: [
        MultiEditRoutingModule,
        MultiEditServiceModule,
        SharedModule,
        DisplaySharedModule,
    ]
})
export class MultiEditModule {}
