import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BusyComponent } from './busy/busy.component';
import { RoleDisplayComponent } from './inputs/role-display/role-display.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
    declarations: [
        BusyComponent,
        RoleDisplayComponent,
        ChangePasswordComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatInputModule,
        MatMenuModule,
        MatProgressSpinnerModule,
    ],
    exports: [
        BusyComponent,
        RoleDisplayComponent,
        ChangePasswordComponent,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatInputModule,
        MatMenuModule,
        MatProgressSpinnerModule,
    ],
})
export class CoreModule{}
