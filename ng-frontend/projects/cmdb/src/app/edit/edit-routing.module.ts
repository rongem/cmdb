import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditItemComponent } from './edit-item/edit-item.component';
import { CreateItemComponent } from './create-item/create-item.component';
import { CopyItemComponent } from './copy-item/copy-item.component';
import { ImportItemsComponent } from './import-items/import-items.component';
import { ItemFrameComponent } from '../shared/item-frame/item-frame.component';
import { MultiEditComponent } from './multi-edit/multi-edit.component';
import { MultiDeleteComponent } from './multi-delete/multi-delete.component';

const editRoutes: Routes = [
    { path: '', component: ItemFrameComponent, children: [
        { path: '', pathMatch: 'full', redirectTo: '/display' },
        { path: 'import', component: ImportItemsComponent },
        { path: 'configuration-item/create', component: CreateItemComponent },
        { path: 'configuration-item/:id', component: EditItemComponent },
        { path: 'configuration-item/:id/copy', component: CopyItemComponent },
        { path: 'multiple-items', component: MultiEditComponent },
        { path: 'delete-multiple-items', component: MultiDeleteComponent },
    ]},
];

@NgModule({
    imports: [RouterModule.forChild(editRoutes)],
    exports: [RouterModule]
})
export class EditRoutingModule {}
