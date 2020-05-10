import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AssetRoutingModule } from './asset-routing.module';

import { RackComponent } from './rack/rack.component';
import { EnclosureComponent } from './enclosure/enclosure.component';
import { ServerHardwareComponent } from './server-hardware/server-hardware.component';
import { ItemsComponent } from './items/items.component';
import { ItemComponent } from './items/item/item.component';
import { ItemListComponent } from './items/item-list/item-list.component';
import { ItemFormComponent } from './items/item-form/item-form.component';
import { AssetComponent } from './asset.component';
import { RackMountableComponent } from './rack-mountable/rack-mountable.component';
import { EnclosureMountableComponent } from './enclosure-mountable/enclosure-mountable.component';
import { ContentsComponent } from './contents/contents.component';
import { RacksComponent } from './racks/racks.component';
import { RackFormComponent } from './racks/rack-form/rack-form.component';
import { RackMountableFormComponent } from './rack-mountable/rack-mountable-form/rack-mountable-form.component';
import { EnclosureFormComponent } from './enclosure/enclosure-form/enclosure-form.component';
import { EnclosureMountableFormComponent } from './enclosure-mountable/enclosure-mountable-form/enclosure-mountable-form.component';
import { SelectStatusComponent } from './select-status/select-status.component';

@NgModule({
    declarations: [
      RackComponent,
      EnclosureComponent,
      ServerHardwareComponent,
      ItemsComponent,
      ItemComponent,
      ItemListComponent,
      ItemFormComponent,
      AssetComponent,
      RackMountableComponent,
      EnclosureMountableComponent,
      ContentsComponent,
      RacksComponent,
      RackFormComponent,
      RackMountableFormComponent,
      EnclosureFormComponent,
      EnclosureMountableFormComponent,
      SelectStatusComponent,
    ],
    imports: [
      AssetRoutingModule,
      SharedModule,
    ],
  })
  export class AssetModule { }
