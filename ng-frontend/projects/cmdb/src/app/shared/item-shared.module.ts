import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { ItemMenuComponent } from './item-menu/item-menu.component';
import { DisplayEffects } from './store/display/display.effects';
import { SearchEffects, EditEffects, MultiEditEffects, ValidatorModule } from 'backend-access';
import { RouterEffects } from './store/router.effects';


@NgModule({
    declarations: [
        ItemMenuComponent,
    ],
    imports: [
        RouterModule,
        CommonModule,
        MatButtonModule,
        EffectsModule.forFeature([DisplayEffects, SearchEffects, EditEffects, RouterEffects, MultiEditEffects]),
        ValidatorModule
    ],
    exports: [
        ItemMenuComponent,
        ValidatorModule,
    ]
})

export class ItemSharedModule {}
