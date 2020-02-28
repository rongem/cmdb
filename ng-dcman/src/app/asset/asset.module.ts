import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from 'src/app/shared/shared.module';

import { RackComponent } from './rack/rack.component';
import { EnclosureComponent } from './enclosure/enclosure.component';
import { ServerHardwareComponent } from './server-hardware/server-hardware.component';
import { HardwareComponent } from './hardware/hardware.component';

@NgModule({
    declarations: [
      RackComponent,
      EnclosureComponent,
      ServerHardwareComponent,
      HardwareComponent
    ],
    imports: [
      EffectsModule.forFeature([]),
      SharedModule,
    ],
  })
  export class AssetModule { }
