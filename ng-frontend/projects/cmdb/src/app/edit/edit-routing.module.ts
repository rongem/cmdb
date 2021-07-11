import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditItemComponent } from './edit-item/edit-item.component';
import { CreateItemComponent } from './create-item/create-item.component';
import { CopyItemComponent } from './copy-item/copy-item.component';
import { ImportItemsComponent } from './import-items/import-items.component';

const editRoutes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/search' },
    { path: 'multiple-items', loadChildren: () => import('../multi-edit/multi-edit.module').then(m => m.MultiEditModule) },
    { path: 'import', component: ImportItemsComponent },
    { path: 'configuration-item/create', component: CreateItemComponent },
    { path: 'configuration-item/:id', component: EditItemComponent },
    { path: 'configuration-item/:id/copy', component: CopyItemComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(editRoutes)],
    exports: [RouterModule]
})
export class EditRoutingModule {}
