import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ClipboardModule } from 'ngx-clipboard';

import { DropdownDirective } from './dropdown.directive';
import { HoverDirective } from './hover.directive';
import { TextInputComponent } from './inputs/text-input/text-input.component';

@NgModule({
    declarations: [
        DropdownDirective,
        HoverDirective,
        TextInputComponent,
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
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
        ClipboardModule,
        TextInputComponent,
    ]
})
export class SharedModule {

}
