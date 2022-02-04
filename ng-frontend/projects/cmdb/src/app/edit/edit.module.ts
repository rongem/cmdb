import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { EffectsModule } from '@ngrx/effects';
import { EditEffects, MultiEditEffects, ValidatorModule } from 'backend-access';
import { CoreModule } from '../shared/core.module';

import { ItemSharedModule } from '../shared/item-shared.module';
import { AddConnectionComponent } from './add-connection/add-connection.component';
import { CopyItemComponent } from './copy-item/copy-item.component';
import { CreateItemComponent } from './create-item/create-item.component';
import { EditItemConnectionsComponent } from './edit-item-connections/edit-item-connections.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { EditRoutingModule } from './edit-routing.module';
import { ImportItemsComponent } from './import-items/import-items.component';


@NgModule({
    declarations: [
        AddConnectionComponent,
        EditItemComponent,
        EditItemConnectionsComponent,
        CopyItemComponent,
        CreateItemComponent,
        ImportItemsComponent,
    ],
    imports: [
        EditRoutingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
        ItemSharedModule,
        EffectsModule.forFeature([EditEffects, MultiEditEffects]),
        MatSelectModule,
        MatSlideToggleModule,
        MatTableModule,
        ValidatorModule,
    ],
})

export class EditModule{}
