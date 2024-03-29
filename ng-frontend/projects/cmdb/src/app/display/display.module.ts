import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { SearchEffects } from 'backend-access';
import { CoreModule } from '../shared/core.module';

import { ItemSharedModule } from '../shared/item-shared.module';
import { ConfigurationItemComponent } from './configuration-item/configuration-item.component';
import { GraphItemComponent } from './graph-item/graph-item.component';
import { ShowGraphComponent } from './show-graph/show-graph.component';
import { DisplayRoutingModule } from './display-routing.module';
import { DisplayServiceModule } from './display-service.module';
import { ItemSelectorComponent } from './item-selector/item-selector.component';
import { MultiSelectorComponent } from './multi-selector/multi-selector.component';
import { ItemListComponent } from './item-list/item-list.component';
import { DisplayComponent } from './display.component';
import { FilterFormComponent } from './filter-form/filter-form.component';
import { ItemTypeListComponent } from './item-type-list/item-type-list.component';
import { ItemContainerComponent } from './item-container/item-container.component';
import { NeighborListComponent } from './neighbor-list/neighbor-list.component';
import { ShowHistoryComponent } from './show-history/show-history.component';

@NgModule({
    declarations: [
        DisplayComponent,
        ConfigurationItemComponent,
        FilterFormComponent,
        GraphItemComponent,
        ItemListComponent,
        ItemContainerComponent,
        ItemTypeListComponent,
        ItemSelectorComponent,
        MultiSelectorComponent,
        NeighborListComponent,
        ShowGraphComponent,
        ShowHistoryComponent,
    ],
    imports: [
        ClipboardModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DisplayRoutingModule,
        CoreModule,
        ItemSharedModule,
        DisplayServiceModule,
        EffectsModule.forFeature([ SearchEffects ]),
    ],
})

export class DisplayModule {}
