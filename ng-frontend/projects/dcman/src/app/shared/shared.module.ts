import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { BusyComponent } from './busy/busy.component';
import { FormPopupComponent } from './form-popup/form-popup.component';
import { LoginFormComponent } from './login-form/login-form.component';

@NgModule({
    declarations: [
        BusyComponent,
        FormPopupComponent,
        LoginFormComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [
        BusyComponent,
        FormPopupComponent,
        LoginFormComponent,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ]
})
export class SharedModule {
}
