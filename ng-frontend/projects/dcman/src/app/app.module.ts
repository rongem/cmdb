import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';

import * as fromApp from './shared/store/app.reducer';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';

import { environment } from '../environments/environment.prod';
import { MetaDataEffects } from './shared/store/meta-data.effects';
import { DataEffects } from './shared/store/data.effects';
import { BasicsEffects } from './shared/store/basics/basics.effects';
import { AssetEffects } from './shared/store/asset/asset.effects';
import { AppConfigService } from './shared/app-config.service';
import { CoreModule } from './core.module';
import { NgrxRouterStoreModule } from './shared/store/router/router.module';

import { AppComponent } from './app.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomComponent } from './rooms/room/room.component';
import { HeaderComponent } from './header/header.component';

function initializeApp(appConfig: AppConfigService) {
  return () => appConfig.loadSettings();
}

registerLocaleData(localeEn);

@NgModule({
  declarations: [
    AppComponent,
    RoomsComponent,
    RoomComponent,
    HeaderComponent,
],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([MetaDataEffects, BasicsEffects, AssetEffects, DataEffects]),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    CoreModule,
    SharedModule,
    NgrxRouterStoreModule,
  ],
  providers: [
    Title,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfigService], multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }