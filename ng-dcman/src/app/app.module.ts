import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/de';

import * as fromApp from './shared/store/app.reducer';

import { AppRoutingModule } from './app-routing.module';
// import { SharedModule } from './shared/shared.module';

import { environment } from 'src/environments/environment.prod';
import { MetaDataEffects } from './shared/store/meta-data.effects';
import { AppConfigService } from './shared/app-config.service';
import { CoreModule } from './core.module';

import { AppComponent } from './app.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomComponent } from './rooms/room/room.component';
import { RackComponent } from './rack/rack.component';
import { EnclosureComponent } from './rack/enclosure/enclosure.component';
import { ServerHardwareComponent } from './rack/server-hardware/server-hardware.component';
import { HardwareComponent } from './rack/hardware/hardware.component';
import { BusyComponent } from './shared/busy/busy.component';

function initializeApp(appConfig: AppConfigService) {
  return () => appConfig.loadSettings();
}

function initializeSettings(appConfig: AppConfigService) {
  return () => appConfig.loadAppSettings();
}

registerLocaleData(localeEn);

@NgModule({
  declarations: [
    AppComponent,
    BusyComponent,
    RoomsComponent,
    RoomComponent,
    RackComponent,
    EnclosureComponent,
    ServerHardwareComponent,
    HardwareComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([MetaDataEffects]),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    CoreModule,
    // SharedModule,
  ],
  providers: [
    Title,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfigService], multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeSettings,
      deps: [AppConfigService], multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
