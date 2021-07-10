import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditItemComponent } from './edit-item/edit-item.component';

const editRoutes = [
    { path: '', patchMatch: 'full', },
    { path: 'multiple', loadChildren: () => import('../multi-edit/multi-edit.module').then(m => m.MultiEditModule) },
    { path: 'configuration-item/:id', component: EditItemComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(editRoutes)],
    exports: [RouterModule]
  })
export class EditRoutingModule {}
