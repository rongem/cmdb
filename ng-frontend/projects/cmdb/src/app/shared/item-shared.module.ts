import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';

import { ActionListComponent } from './action-list/action-list.component';
import { CoreModule } from './core.module';
import { ExportItemsComponent } from './export-items/export-items.component';
import { ItemFrameComponent } from './item-frame/item-frame.component';
import { ItemEffects } from './store/item/item.effects';

@NgModule({
    declarations: [
        ActionListComponent,
        ExportItemsComponent,
        ItemFrameComponent,
    ],
    imports: [
        RouterModule,
        ClipboardModule,
        CommonModule,
        CoreModule,
        FormsModule,
        EffectsModule.forFeature([ItemEffects]),
    ],
    exports: [
        ActionListComponent,
        ItemFrameComponent,
    ]
})

export class ItemSharedModule {}
