import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
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


import * as fromApp from './shared/store/app.reducer';
import { MetaDataEffects } from './shared/store/meta-data.effects';
import { environment } from 'src/environments/environment.prod';
import { SearchEffects } from './display/search/store/search.effects';
import { ConfigurationItemEffects } from './display/configuration-item/store/configuration-item.effects';
import { AdminModule } from './admin/admin.module';

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
    AdminModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([MetaDataEffects, SearchEffects, ConfigurationItemEffects]),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    StoreRouterConnectingModule.forRoot(),
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
