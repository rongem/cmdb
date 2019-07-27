import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import 'hammerjs';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { WinAuthInterceptor } from './shared/win-auth.interceptor';
import { AdminModule } from './admin/admin.module';
import { DisplayModule } from './display/display.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';

import * as fromApp from './shared/store/app.reducer';
import { MetaDataEffects } from './shared/store/meta-data.effects';
import { environment } from 'src/environments/environment.prod';
import { SearchEffects } from './display/search/store/search.effects';
import { ConfigurationItemEffects } from './display/configuration-item/store/configuration-item.effects';

registerLocaleData(localeDe);

@NgModule({
  declarations: [
    AppComponent,
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
    MatSnackBarModule,
    MatDialogModule,
  ],
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
  bootstrap: [AppComponent]
})

export class AppModule { }
