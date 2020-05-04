import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { BusyComponent } from './busy/busy.component';
import { DropdownDirective } from './dropdown.directive';
import { FormPopupComponent } from './form-popup/form-popup.component';

@NgModule({
    declarations: [
        BusyComponent,
        DropdownDirective,
        FormPopupComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [
        BusyComponent,
        FormPopupComponent,
        DropdownDirective,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ]
})
export class SharedModule {
}
