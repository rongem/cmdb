import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatMenuModule, MatIconModule } from '@angular/material';

import { DropdownDirective } from './dropdown.directive';
import { HoverDirective } from './hover.directive';

@NgModule({
    declarations: [
        DropdownDirective,
        HoverDirective,
    ],
    imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
    ],
    exports: [
        CommonModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        DropdownDirective,
        HoverDirective,
    ]
})
export class SharedModule {

}