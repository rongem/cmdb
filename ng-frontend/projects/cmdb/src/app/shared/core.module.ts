import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BusyComponent } from './busy/busy.component';
import { RoleDisplayComponent } from './inputs/role-display/role-display.component';
import { TextInputComponent } from './inputs/text-input/text-input.component';
import { MenuTemplateComponent } from './menu-template/menu-template.component';
import { ClickOpenDirective } from './click-open.directive';

@NgModule({
    declarations: [
        BusyComponent,
        RoleDisplayComponent,
        TextInputComponent,
        MenuTemplateComponent,
        ClickOpenDirective,
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
        TextInputComponent,
        MenuTemplateComponent,
        ClickOpenDirective,
    ],
})
export class CoreModule{}
