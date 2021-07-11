import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BusyComponent } from './busy/busy.component';
import { RoleDisplayComponent } from './inputs/role-display/role-display.component';

@NgModule({
    declarations: [
        BusyComponent,
        RoleDisplayComponent,
    ],
    imports: [
        MatMenuModule,
        MatProgressSpinnerModule,
    ],
    exports: [
        BusyComponent,
        RoleDisplayComponent,
        MatMenuModule,
        MatProgressSpinnerModule,
    ],
})
export class GlobalSharedModule{}
