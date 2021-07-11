import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { GlobalSharedModule } from './global-shared.module';
import { TextInputComponent } from './inputs/text-input/text-input.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
    declarations: [
        TextInputComponent,
        LoginFormComponent,
        ChangePasswordComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ClipboardModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatSlideToggleModule,
        MatTableModule,
        MatTooltipModule,
        ReactiveFormsModule,
        GlobalSharedModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ClipboardModule,
        LoginFormComponent,
        MatAutocompleteModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatSlideToggleModule,
        MatTableModule,
        MatTooltipModule,
        ReactiveFormsModule,
        TextInputComponent,
        GlobalSharedModule,
    ]
})
export class SharedModule {}
