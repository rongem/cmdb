import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';

import { ExportItemComponent } from './export-item/export-item.component';
import { ExportItemsComponent } from './export-items/export-items.component';
import { ItemMenuComponent } from './item-menu/item-menu.component';
import { ShowHistoryComponent } from './show-history/show-history.component';
import { ItemFrameComponent } from './item-frame/item-frame.component';
import { ItemEffects } from './store/item/item.effects';


@NgModule({
    declarations: [
        ItemMenuComponent,
        ShowHistoryComponent,
        ExportItemsComponent,
        ExportItemComponent,
        ItemFrameComponent,
    ],
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatDialogModule,
        MatInputModule,
        MatMenuModule,
        MatTableModule,
        EffectsModule.forFeature([ItemEffects]),
    ],
    exports: [
        ItemMenuComponent,
        ItemFrameComponent,
    ]
})

export class ItemSharedModule {}
