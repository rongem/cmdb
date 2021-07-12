import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BusyComponent } from './busy/busy.component';
import { RoleDisplayComponent } from './inputs/role-display/role-display.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { TextInputComponent } from './inputs/text-input/text-input.component';

@NgModule({
    declarations: [
        BusyComponent,
        RoleDisplayComponent,
        ChangePasswordComponent,
        TextInputComponent,
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
        TextInputComponent,
    ],
})
export class CoreModule{}
