import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import 'hammerjs';

import { AppRoutingModule } from './app-routing.module';
import { DisplayModule } from './display/display.module';
import { SharedModule } from './shared/shared.module';
import { WinAuthInterceptor } from './shared/win-auth.interceptor';

import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { HeaderComponent } from './header/header.component';

import { MetaDataService } from './shared/meta-data.service';
import { DataAccessService } from './shared/data-access.service';
import { StoreModule } from '@ngrx/store';

import { MetaDataReducer } from './shared/store/meta-data.reducer';
import { ConfigurationItemReducer } from './display/configuration-item/store/configuration-item.reducer';
import { SearchReducer } from './display/search/store/search.reducer';

registerLocaleData(localeDe);

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
    StoreModule.forRoot({
      metaData: MetaDataReducer,
      configurationItem: ConfigurationItemReducer,
      search: SearchReducer,
    }),
    SharedModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WinAuthInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})

export class AppModule { }
