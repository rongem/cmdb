import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { BusyComponent } from './busy/busy.component';
import { DropdownDirective } from './dropdown.directive';

@NgModule({
    declarations: [
        BusyComponent,
        DropdownDirective,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [
        BusyComponent,
        DropdownDirective,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ]
})
export class SharedModule {
}
