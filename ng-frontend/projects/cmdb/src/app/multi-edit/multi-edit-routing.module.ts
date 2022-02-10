import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemFrameComponent } from '../shared/item-frame/item-frame.component';
import { MultiEditComponent } from './multi-edit.component';
import { MultiResultsComponent } from './multi-results/multi-results.component';
import { MultiWorkingComponent } from './multi-working/multi-working.component';

const multiEditRoutes: Routes = [
    { path: '', component: ItemFrameComponent, children: [
        { path: '', pathMatch: 'full', component: MultiEditComponent },
        { path: 'working', component: MultiWorkingComponent },
        { path: 'done', component: MultiResultsComponent },
    ]},
];

@NgModule({
    imports: [ RouterModule.forChild(multiEditRoutes) ],
    exports: [ RouterModule ]
})
export class MultiEditRoutingModule {}
