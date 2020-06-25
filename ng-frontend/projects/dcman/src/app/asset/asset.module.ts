import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AssetRoutingModule } from './asset-routing.module';

import { AssetComponent } from './asset/asset.component';
import { RackComponent } from './rack/rack.component';
import { ContentsComponent } from './contents/contents.component';
import { RacksComponent } from './racks/racks.component';
import { RackFormComponent } from './racks/rack-form/rack-form.component';
import { AssetFormComponent } from './asset-form/asset-form.component';
import { CreateAssetFormComponent } from './create-asset-form/create-asset-form.component';
import { ServerHardwareComponent } from './server-hardware/server-hardware.component';
import { MountableFormComponent } from './mountable-form/mountable-form.component';
import { RackMountFormComponent } from './rack-mount-form/rack-mount-form.component';

@NgModule({
    declarations: [
      RackComponent,
      AssetComponent,
      ContentsComponent,
      RacksComponent,
      RackFormComponent,
      AssetFormComponent,
      CreateAssetFormComponent,
      ServerHardwareComponent,
      MountableFormComponent,
      RackMountFormComponent,
    ],
    imports: [
      AssetRoutingModule,
      SharedModule,
    ],
  })
  export class AssetModule { }
