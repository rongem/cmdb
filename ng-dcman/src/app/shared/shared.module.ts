import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { BusyComponent } from './busy/busy.component';

@NgModule({
    declarations: [
        BusyComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [
        BusyComponent,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ]
})
export class SharedModule {
}
