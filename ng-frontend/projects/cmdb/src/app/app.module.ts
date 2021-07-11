import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { registerLocaleData } from '@angular/common';
import { AppConfigService, MetaDataEffects, AuthInterceptor } from 'backend-access';

import * as fromApp from './shared/store/app.reducer';

import { AppRoutingModule } from './app-routing.module';
import { GlobalSharedModule } from './shared/global-shared.module';
import { NgrxRouterStoreModule } from './shared/store/router/router.module';
import { environment } from '../environments/environment';
import { HoverDirective } from './shared/hover.directive';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';

export const initializeApp = (appConfig: AppConfigService) => () => appConfig.load(environment.name);

registerLocaleData(localeDe);

@NgModule({
  declarations: [
    HoverDirective,
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
    GlobalSharedModule,
    MatSnackBarModule,
    NgrxRouterStoreModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    Title,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfigService], multi: true
    }, {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }, {
      provide: MatDialogRef,
      useValue: {}
    }, {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {hasBackdrop: true}
    }

  ],
})

export class AppModule { }
