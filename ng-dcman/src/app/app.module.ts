import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomComponent } from './rooms/room/room.component';
import { RackComponent } from './rack/rack.component';
import { EnclosureComponent } from './rack/enclosure/enclosure.component';
import { ServerHardwareComponent } from './rack/server-hardware/server-hardware.component';
import { HardwareComponent } from './rack/hardware/hardware.component';

@NgModule({
  declarations: [
    AppComponent,
    RoomsComponent,
    RoomComponent,
    RackComponent,
    EnclosureComponent,
    ServerHardwareComponent,
    HardwareComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
