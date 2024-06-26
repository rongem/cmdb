import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AuthInterceptor, EnvServiceProvider, MetaDataEffects, ValidatorModule } from 'backend-access';

import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';

import * as fromApp from './shared/store/app.reducer';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';

import { environment } from '../environments/environment.prod';
import { SchemaEffects } from './shared/store/schema.effects';
import { BasicsEffects } from './shared/store/basics/basics.effects';
import { AssetEffects } from './shared/store/asset/asset.effects';
import { ProvisionableEffects } from './shared/store/provisionable/provisionable.effects';

import { ExtendedAppConfigService } from './shared/app-config.service';
import { NgrxRouterStoreModule } from './shared/store/router/router.module';

import { AppComponent } from './app.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomComponent } from './rooms/room/room.component';
import { HeaderComponent } from './header/header.component';
import { RoomFormComponent } from './rooms/room-form/room-form.component';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function initializeApp(appConfig: ExtendedAppConfigService) {
  return () => appConfig.loadSettings();
}

registerLocaleData(localeEn);

@NgModule({
    declarations: [
        AppComponent,
        RoomsComponent,
        RoomComponent,
        HeaderComponent,
        RoomFormComponent,
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        StoreModule.forRoot(fromApp.appReducer),
        EffectsModule.forRoot([MetaDataEffects, SchemaEffects, BasicsEffects, AssetEffects, ProvisionableEffects]),
        StoreDevtoolsModule.instrument({ logOnly: environment.production, connectInZone: true }),
        SharedModule,
        NgrxRouterStoreModule,
        ValidatorModule], providers: [
        Title,
        EnvServiceProvider,
        {
            provide: APP_INITIALIZER,
            useFactory: initializeApp,
            deps: [ExtendedAppConfigService], multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule { }
