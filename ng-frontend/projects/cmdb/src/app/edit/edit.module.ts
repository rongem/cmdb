import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { EditEffects, ValidatorModule } from 'backend-access';
import { CoreModule } from '../shared/core.module';
import { ItemSharedModule } from '../shared/item-shared.module';

import { MultiEditEffects } from '../shared/store/multi-edit/multi-edit.effects';
import { AddConnectionComponent } from './add-connection/add-connection.component';
import { CopyItemComponent } from './copy-item/copy-item.component';
import { CreateItemComponent } from './create-item/create-item.component';
import { EditItemConnectionsComponent } from './edit-item-connections/edit-item-connections.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { EditRoutingModule } from './edit-routing.module';
import { EditServiceModule } from './edit-service.module';
import { ImportItemsComponent } from './import-items/import-items.component';
import { MultiEditComponent } from './multi-edit/multi-edit.component';
import { MultiDeleteComponent } from './multi-delete/multi-delete.component';


@NgModule({
    declarations: [
        AddConnectionComponent,
        CopyItemComponent,
        CreateItemComponent,
        EditItemComponent,
        EditItemConnectionsComponent,
        ImportItemsComponent,
        MultiEditComponent,
        MultiDeleteComponent,
    ],
    imports: [
        EditRoutingModule,
        EditServiceModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
        ItemSharedModule,
        EffectsModule.forFeature([EditEffects, MultiEditEffects]),
        ValidatorModule,
    ],
})

export class EditModule{}
