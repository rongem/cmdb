import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ClipboardModule } from 'ngx-clipboard';

import { DropdownDirective } from './dropdown.directive';
import { HoverDirective } from './hover.directive';
import { TextInputComponent } from './inputs/text-input/text-input.component';
import { RoleDisplayComponent } from './inputs/role-display/role-display.component';

@NgModule({
    declarations: [
        DropdownDirective,
        HoverDirective,
        TextInputComponent,
        RoleDisplayComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        MatIconModule,
        MatTooltipModule,
        MatDialogModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatCheckboxModule,
        MatListModule,
        MatSlideToggleModule,
        MatAutocompleteModule,
    ],
    exports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        MatTooltipModule,
        MatDialogModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatCheckboxModule,
        MatListModule,
        MatSlideToggleModule,
        MatAutocompleteModule,
        DropdownDirective,
        HoverDirective,
        ClipboardModule,
        TextInputComponent,
        RoleDisplayComponent,
    ]
})
export class SharedModule {

}
