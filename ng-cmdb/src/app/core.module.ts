import { NgModule } from '@angular/core';
import { WinAuthInterceptor } from './shared/win-auth.interceptor';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
    providers: [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: WinAuthInterceptor,
        multi: true
      },
      {
        provide: MAT_DIALOG_DEFAULT_OPTIONS,
        useValue: {hasBackdrop: true}
      }
    ],
  })
export class CoreModule {}
