import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { DisplayModule } from './display/display.module';
import { SharedModule } from './shared/shared.module';
import { WinAuthInterceptor } from './shared/win-auth.interceptor';

import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { HeaderComponent } from './header/header.component';

import { MetaDataService } from './shared/meta-data.service';
import { DataAccessService } from './shared/data-access.service';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DisplayModule,
    SharedModule,
  ],
  providers: [
    MetaDataService,
    DataAccessService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WinAuthInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})

export class AppModule { }
