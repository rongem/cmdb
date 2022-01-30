import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';

import { ExportItemComponent } from './export-item/export-item.component';
import { ExportItemsComponent } from './export-items/export-items.component';
import { ItemMenuComponent } from './item-menu/item-menu.component';
import { ItemFrameComponent } from './item-frame/item-frame.component';
import { ItemEffects } from './store/item/item.effects';

@NgModule({
    declarations: [
        ItemMenuComponent,
        ExportItemsComponent,
        ExportItemComponent,
        ItemFrameComponent,
    ],
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatInputModule,
        EffectsModule.forFeature([ItemEffects]),
    ],
    exports: [
        ItemMenuComponent,
        ItemFrameComponent,
    ]
})

export class ItemSharedModule {}
