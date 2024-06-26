import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { appReducer } from './shared/store/app.reducer';
import { RouterEffects } from './shared/store/router.effects';
import { NgrxRouterStoreModule } from './shared/store/router/router.module';

export const initializeApp = (appConfig: AppConfigService) => () => appConfig.load();

registerLocaleData(localeDe);

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        CommonModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        CoreModule,
        CommonModule,
        FormsModule,
        StoreModule.forRoot(appReducer),
        EffectsModule.forRoot([MetaDataEffects, RouterEffects]),
        StoreDevtoolsModule.instrument({ logOnly: environment.production, connectInZone: true }),
        NgrxRouterStoreModule], providers: [
        Title,
        EnvServiceProvider,
        HttpAuthProvider,
        {
            provide: APP_INITIALIZER,
            useFactory: initializeApp,
            deps: [AppConfigService], multi: true
        }, {
            provide: LOCALE_ID, useValue: 'de-DE'
        },
        provideHttpClient(withInterceptorsFromDi())
    ] })

export class AppModule { }
