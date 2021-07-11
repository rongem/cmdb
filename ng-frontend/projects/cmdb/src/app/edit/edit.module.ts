import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { EffectsModule } from '@ngrx/effects';
import { EditEffects, MultiEditEffects, ValidatorModule } from 'backend-access';
import { ItemSharedModule } from '../shared/item-shared.module';
import { SharedModule } from '../shared/shared.module';
import { AddLinkComponent } from './add-link/add-link.component';
import { AddConnectionComponent } from './add-connection/add-connection.component';
import { EditRoutingModule } from './edit-routing.module';
import { EditItemComponent } from './edit-item/edit-item.component';
import { EditItemResponsibilitiesComponent } from './edit-item-responsibilities/edit-item-responsibilities.component';
import { EditItemAttributesComponent } from './edit-item-attributes/edit-item-attributes.component';
import { EditItemLinksComponent } from './edit-item-links/edit-item-links.component';
import { EditItemConnectionsComponent } from './edit-item-connections/edit-item-connections.component';
import { CopyItemComponent } from './copy-item/copy-item.component';
import { CreateItemComponent } from './create-item/create-item.component';
import { ImportItemsComponent } from './import-items/import-items.component';
import { DeleteItemComponent } from './delete-item/delete-item.component';


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
        ItemSharedModule,
        SharedModule,
        EffectsModule.forFeature([EditEffects, MultiEditEffects]),
        MatSelectModule,
        MatButtonModule,
        ValidatorModule,
    ],
})

export class EditModule{}
