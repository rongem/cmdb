import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { EffectsModule } from '@ngrx/effects';
import { EditEffects, MultiEditEffects, ValidatorModule } from 'backend-access';
import { CoreModule } from '../shared/core.module';

import { ItemSharedModule } from '../shared/item-shared.module';
import { AddConnectionComponent } from './add-connection/add-connection.component';
import { AddLinkComponent } from './add-link/add-link.component';
import { CopyItemComponent } from './copy-item/copy-item.component';
import { CreateItemComponent } from './create-item/create-item.component';
import { DeleteItemComponent } from './delete-item/delete-item.component';
import { EditItemAttributesComponent } from './edit-item-attributes/edit-item-attributes.component';
import { EditItemConnectionsComponent } from './edit-item-connections/edit-item-connections.component';
import { EditItemLinksComponent } from './edit-item-links/edit-item-links.component';
import { EditItemResponsibilitiesComponent } from './edit-item-responsibilities/edit-item-responsibilities.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { EditRoutingModule } from './edit-routing.module';
import { ImportItemsComponent } from './import-items/import-items.component';


@NgModule({
    declarations: [
        AddLinkComponent,
        AddConnectionComponent,
        EditItemComponent,
        EditItemResponsibilitiesComponent,
        EditItemAttributesComponent,
        EditItemLinksComponent,
        EditItemConnectionsComponent,
        CopyItemComponent,
        CreateItemComponent,
        ImportItemsComponent,
        DeleteItemComponent,
    ],
    imports: [
        EditRoutingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
        ItemSharedModule,
        EffectsModule.forFeature([EditEffects, MultiEditEffects]),
        MatButtonModule,
        MatDialogModule,
        MatMenuModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatTableModule,
        ValidatorModule,
    ],
})

export class EditModule{}
