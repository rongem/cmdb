import { NgModule } from '@angular/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CoreModule } from './core.module';
import { TextInputComponent } from './inputs/text-input/text-input.component';
import { LoginFormComponent } from './login-form/login-form.component';

@NgModule({
    declarations: [
        TextInputComponent,
        LoginFormComponent,
    ],
    imports: [
        ClipboardModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatIconModule,
        MatSlideToggleModule,
        MatTableModule,
        MatTooltipModule,
        CoreModule,
    ],
    exports: [
        ClipboardModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatIconModule,
        MatSlideToggleModule,
        MatTableModule,
        MatTooltipModule,
        TextInputComponent,
        CoreModule,
        LoginFormComponent,
    ]
})
export class SharedModule {}
