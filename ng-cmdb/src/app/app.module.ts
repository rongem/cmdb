import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import 'hammerjs';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';

import * as fromApp from './shared/store/app.reducer';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { environment } from 'src/environments/environment.prod';
import { MetaDataEffects } from './shared/store/meta-data.effects';
import { NgrxRouterStoreModule } from './shared/store/router/router.module';
import { CoreModule } from './core.module';

registerLocaleData(localeDe);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([MetaDataEffects]),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    SharedModule,
    MatSnackBarModule,
    CoreModule,
    NgrxRouterStoreModule,
  ],
  bootstrap: [AppComponent],
  providers: [Title],
})

export class AppModule { }
