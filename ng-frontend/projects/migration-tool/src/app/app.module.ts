import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppConfigService } from 'backend-access';
import { WinAuthInterceptor } from 'backend-access';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';

function initializeApp(appConfig: AppConfigService) {
  return () => appConfig.load();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfigService], multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WinAuthInterceptor,
      multi: true
    },
],
  bootstrap: [AppComponent]
})
export class AppModule { }
