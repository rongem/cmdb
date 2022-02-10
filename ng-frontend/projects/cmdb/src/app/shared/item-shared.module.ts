import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';

import { ActionListComponent } from './action-list/action-list.component';
import { ExportItemComponent } from './export-item/export-item.component';
import { ExportItemsComponent } from './export-items/export-items.component';
import { ItemFrameComponent } from './item-frame/item-frame.component';
import { ItemEffects } from './store/item/item.effects';

@NgModule({
    declarations: [
        ActionListComponent,
        ExportItemsComponent,
        ExportItemComponent,
        ItemFrameComponent,
    ],
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        MatDialogModule,
        EffectsModule.forFeature([ItemEffects]),
    ],
    exports: [
        ActionListComponent,
        ItemFrameComponent,
    ]
})

export class ItemSharedModule {}
