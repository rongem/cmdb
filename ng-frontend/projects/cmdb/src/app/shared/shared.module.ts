import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { HoverDirective } from './hover.directive';
import { TextInputComponent } from './inputs/text-input/text-input.component';
import { RoleDisplayComponent } from './inputs/role-display/role-display.component';
import { BusyComponent } from './busy/busy.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
    declarations: [
        BusyComponent,
        HoverDirective,
        RoleDisplayComponent,
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
        MatCheckboxModule,
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatProgressSpinnerModule,
        MatSlideToggleModule,
        MatTableModule,
        MatTooltipModule,
        ReactiveFormsModule,
    ],
    exports: [
        BusyComponent,
        CommonModule,
        FormsModule,
        ClipboardModule,
        HoverDirective,
        LoginFormComponent,
        MatAutocompleteModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatProgressSpinnerModule,
        MatSlideToggleModule,
        MatTableModule,
        MatTooltipModule,
        ReactiveFormsModule,
        RoleDisplayComponent,
        TextInputComponent,
    ]
})
export class SharedModule {

}
