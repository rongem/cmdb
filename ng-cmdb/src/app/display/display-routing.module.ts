import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisplayComponent } from './display.component';

const displayRoutes: Routes = [
    {
        path: 'display', component: DisplayComponent, children: [],
    },
];

@NgModule({
    imports: [ RouterModule.forChild(displayRoutes) ],
    exports: [ RouterModule ]
})

export class DisplayRoutingModule {}
