import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppConfigService,  MetaDataEffects, HttpAuthProvider, EnvServiceProvider } from 'backend-access';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { CoreModule } from './shared/core.module';
import { HoverDirective } from './shared/hover.directive';
import { LoginFormComponent } from './shared/login-form/login-form.component';
import { appReducer } from './shared/store/app.reducer';
import { RouterEffects } from './shared/store/router.effects';
import { NgrxRouterStoreModule } from './shared/store/router/router.module';

export const initializeApp = (appConfig: AppConfigService) => () => appConfig.load();

registerLocaleData(localeDe);

@NgModule({
  declarations: [
    HoverDirective,
    AppComponent,
    HeaderComponent,
    LoginFormComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    StoreModule.forRoot(appReducer),
    EffectsModule.forRoot([MetaDataEffects, RouterEffects]),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    NgrxRouterStoreModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    Title,
    EnvServiceProvider,
    HttpAuthProvider,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfigService], multi: true
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
