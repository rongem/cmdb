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
import { OptionComponent } from './option/option.component';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { AutocompleteContentDirective } from './autocomplete/autocomplete-content.directive';
import { AutocompleteDirective } from './autocomplete/autocomplete.directive';
import { FilterPipe } from './autocomplete/filter.pipe';
import { HelpComponent } from './help/help.component';

@NgModule({
    declarations: [
        AutocompleteComponent,
        AutocompleteContentDirective,
        AutocompleteDirective,
        BusyComponent,
        ClickOpenDirective,
        FilterPipe,
        HelpComponent,
        MenuTemplateComponent,
        OptionComponent,
        RoleDisplayComponent,
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
        AutocompleteComponent,
        AutocompleteDirective,
        BusyComponent,
        ClickOpenDirective,
        FilterPipe,
        HelpComponent,
        OptionComponent,
        RoleDisplayComponent,
        MenuTemplateComponent,
        TextInputComponent,
    ],
})
export class CoreModule{}
