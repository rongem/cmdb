import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from 'src/app/shared/shared.module';

import { RoomsComponent } from './rooms.component';
import { RoomComponent } from './room/room.component';

@NgModule({
    declarations: [
        RoomsComponent,
        RoomComponent,
    ],
    imports: [
      EffectsModule.forFeature([]),
      SharedModule,
    ],
  })
  export class RoomsModule { }
