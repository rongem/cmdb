import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { BusyComponent } from './busy/busy.component';
import { FormPopupComponent } from './form-popup/form-popup.component';

@NgModule({
    declarations: [
        BusyComponent,
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
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ]
})
export class SharedModule {
}
