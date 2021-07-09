import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { ItemMenuComponent } from './shared/item-menu/item-menu.component';

@NgModule({
    declarations: [
        ItemMenuComponent,
    ],
    imports: [
        RouterModule,
        CommonModule,
        MatButtonModule,
    ],
    exports: [
        ItemMenuComponent,
    ]
})

export class DisplaySharedModule {}
