import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ClipboardModule } from 'ngx-clipboard';

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
        ClipboardModule,
    ]
})
export class SharedModule {

}
